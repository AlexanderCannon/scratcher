import { useRouter } from "next/router";
import { api } from "../../utils/api";
import Image from "next/image";

const UserPage = () => {
  const { query } = useRouter();

  if (!query.id) {
    return <div>not found</div>;
  }
  const id = typeof query.id === "string" ? query.id : query.id.join(", ");
  const { data } = api.user.getById.useQuery(id);
  console.log(data);
  if (data)
    return (
      <div>
        <Image
          src={data.image ?? ""}
          alt={data.name ?? ""}
          width={100}
          height={100}
        />
        <h1>{data.name}</h1>
      </div>
    );
};

export default UserPage;
