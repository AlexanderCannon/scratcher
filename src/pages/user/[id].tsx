import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Image from "next/image";
import Layout from "~/components/Layout";
import Typography from "~/components/Typography";

const UserPage = () => {
  const { query } = useRouter();

  if (!query.id) {
    return <div>not found</div>;
  }
  const id = typeof query.id === "string" ? query.id : query.id.join(", ");
  const { data } = api.user.getById.useQuery(id);
  if (data)
    return (
      <Layout>
        <Image
          src={data.image ?? ""}
          alt={data.name ?? ""}
          width={100}
          height={100}
        />
        <Typography as="h1" variant="heading">
          {data.name}
        </Typography>
      </Layout>
    );
};

export default UserPage;
