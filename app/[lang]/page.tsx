const Page = () => {
  return (
    <div className="max-w-sm bg-gray-100 p-4">
      <p className="text-lg text-gray-800 truncate-fade">
        This is a long text that demonstrates a smooth transition from visible
        to invisible instead of the usual ellipsis dots at the end of truncated
        text. This gives a more elegant way to handle overflow.
      </p>
    </div>
  );
};

export default Page;
