import { useState, useEffect, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { type ChangeEvent, type FormEvent, type Dispatch } from "react";
import Image from "next/image";
import { api } from "~/utils/api";
import NotFound from "~/components/NotFound";
import ImageUploader from "~/components/PhotoPicker";
import Layout from "~/components/Layout";
import Input from "~/components/Input";
import Button from "~/components/Button";
import Toast from "~/components/Toast";
import Card from "~/components/Card";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  submit?: string;
  image?: string;
  username?: string;
  slug?: string;
  form?: string;
}

export default function SettingsPage() {
  const { data: sessionData } = useSession();
  const { data: user } = api.user.get.useQuery();
  const updateProfile = api.user.update.useMutation();

  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [phone, setPhone] = useState<string>(user?.phone ?? "");
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [slug, setSlug] = useState<string>(user?.slug ?? "");
  const [slugDirty, setSlugDirty] = useState<boolean>(!!user?.slug);
  const [image, setImage] = useState<string>(user?.image ?? "");
  const [saving, setSaving] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      setUsername(user.username ?? "");
      setSlug(user.slug ?? "");
      setImage(user.image ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (username && !slugDirty) {
      guessSlug();
    }
  }, [username]);

  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlugDirty(true);
    setSlug(event.target.value);
  };

  const handleChange =
    (setter: Dispatch<SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      setter(event.target.value);

  const guessSlug = () => {
    if (username) {
      const derivedSlug = username
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(derivedSlug);
    }
  };

  const handleImageUpload = ([file]: File[]) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim();
    const sanitizedPhone = phone.trim();
    const sanitizedUsername = username.trim();
    const sanitizedSlug = slug.trim();
    const sanitizedImage = image.trim();

    const errors: FormErrors = {};
    if (!sanitizedName && sanitizedName != user?.name) {
      errors.name = "Name is required";
    }
    if (!sanitizedEmail && sanitizedEmail != user?.email) {
      errors.email = "Email is required";
    }
    if (
      user?.phone &&
      user.phone !== sanitizedPhone &&
      !/^[\d\s()+-]{10,}$/g.test(sanitizedPhone)
    ) {
      errors.phone = "Please enter a valid phone number";
    }
    if (
      user?.username &&
      user.username !== sanitizedUsername &&
      !/^[a-zA-Z0-9_-]{3,16}$/g.test(sanitizedUsername)
    ) {
      errors.username =
        "A username can only contain letters, numbers, underscores, and dashes";
    }

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      setSaving(false);
      return;
    }

    try {
      updateProfile.mutate({
        name: sanitizedName,
        email: sanitizedEmail,
        phone: sanitizedPhone,
        username: sanitizedUsername,
        slug: sanitizedSlug,
        image: sanitizedImage,
      });
    } catch (error) {
      setSaving(false);
      setFormErrors({ form: "Failed to update profile. Please try again." });
      return;
    }
    setShowToast(true);
    setFormErrors({});
    setSaving(false);
  };

  if (!sessionData?.user) {
    return <NotFound />;
  }

  return (
    <Layout>
      <Image
        src={image ?? ""}
        alt={name ?? ""}
        width={100}
        height={100}
        className="rounded-full"
      />
      <h1 className="mb-6 text-3xl font-semibold text-gray-800">
        Account Settings
      </h1>
      {formErrors.form && (
        <div
          className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <span className="block sm:inline">{formErrors.form}</span>
        </div>
      )}
      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="mb-4 flex flex-col">
              <label htmlFor="name" className="mb-2 font-medium text-gray-800">
                Name
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange(setName)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div className="mb-4 flex flex-col">
              <label htmlFor="email" className="mb-2 font-medium text-gray-800">
                Email
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange(setEmail)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="mb-4 flex flex-col">
              <label htmlFor="name" className="mb-2 font-medium text-gray-800">
                Username
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={username}
                onChange={handleChange(setUsername)}
                className={formErrors.username ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div className="mb-4 flex flex-col">
              <label htmlFor="name" className="mb-2 font-medium text-gray-800">
                Unique link
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={slug}
                onChange={handleSlugChange}
                className={formErrors.slug ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>
            <div className="mb-4 flex flex-col">
              <label htmlFor="phone" className="mb-2 font-medium text-gray-800">
                Phone
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={handleChange(setPhone)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>
            <div className="mb-4 flex flex-col">
              <label htmlFor="image" className="mb-2 font-medium text-gray-800">
                Profile Image
              </label>
              <ImageUploader
                placeHolder={!!image ? "Upload new image" : "Upload image"}
                onSelect={handleImageUpload}
                className={formErrors.image ? "border-red-500" : ""}
              />
              {formErrors.image && (
                <p className="mt-1 text-sm text-red-500">{formErrors.image}</p>
              )}
            </div>
          </div>
          <div className="mb-4 mt-6 flex flex-col">
            <Button type="submit" fullWidth disabled={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
      <Toast
        visible={showToast}
        message="Settings saved successfully!"
        type="success"
        onClose={() => setShowToast(false)}
      />
    </Layout>
  );
}
