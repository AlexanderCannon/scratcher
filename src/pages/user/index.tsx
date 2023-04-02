import { api } from "~/utils/api";

const UserPage = () => {
  const userQuery = api.user.getAll.useQuery();
  return (
    <div>
      {userQuery.data?.map((user) => {
        return (
          <div key={user.id}>
            <a href={`user/${user.id}`}>{user.name}</a>
          </div>
        );
      })}
    </div>
  );
};

export default UserPage;
