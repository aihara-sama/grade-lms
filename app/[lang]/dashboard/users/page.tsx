import Users from "@/components/users";

const Page = async () => {
  return (
    <div className="h-full flex flex-col">
      <p className="text-3xl font-bold text-neutral-600">Users</p>
      <p className="text-neutral-500">View and manage users</p>
      <hr className="my-2 mb-4" />
      <Users />
    </div>
  );
};

export default Page;
