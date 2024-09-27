import Cmp from "@/components/cmp";
import Provider from "@/components/provider";

const Page = () => {
  return (
    <div>
      Server{" "}
      <Provider state="server state">
        <Cmp />
      </Provider>
    </div>
  );
};

export default Page;
