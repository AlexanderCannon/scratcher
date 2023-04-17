import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";
import Typography from "./Typography";
import Button from "./Buttons/Button";
import { RoleContext } from "~/context/role";

type AvailableRoles = Extract<UserRole, "EDITOR" | "CONTRIBUTOR">;

export default function SelectRole() {
  const { data } = useSession();

  //   const [asUser, setAsUser] = useState<AvailableRoles | null>(null);
  //   const cookie = document.cookie
  //     .split("; ")
  //     .find((row) => row.startsWith("asUser="));
  //   if (cookie) {
  //     setAsUser(cookie.split("=")[1] as AvailableRoles);
  //   }

  const { setRole } = useContext(RoleContext);

  const updateRole = api.user.update.useMutation();

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  const handleRoleChange = (role: AvailableRoles) => async () => {
    await updateRole.mutate({ role });
    setRole(role);
  };

  //   if (asUser && data?.user.role !== UserRole.USER) {
  //     handleRoleChange(asUser)();
  //   }

  return (
    <div
      className="display z-25 fixed left-0 top-0 grid h-screen w-screen
    grid-cols-1 place-items-center overflow-hidden bg-slate-800 align-middle"
    >
      <>&nbsp;</>
      <Typography as="h1" variant="title">
        Wait! 🚨
      </Typography>
      <Typography as="p" variant="subheading">
        Before you start, please select your role
      </Typography>
      <div>
        <Button
          fullWidth
          className="m-3"
          onClick={handleRoleChange("CONTRIBUTOR")}
        >
          I want to write 🖊
        </Button>

        <Button fullWidth className="m-3" onClick={handleRoleChange("EDITOR")}>
          I want to publish 📚
        </Button>
      </div>
      <>&nbsp;</>
    </div>
  );
}
