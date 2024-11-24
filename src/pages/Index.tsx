import { LinkChecker } from "@/components/LinkChecker";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            M3U8 Link Checker
          </h1>
          <p className="text-lg text-gray-600">
            Verify the status and accessibility of your M3U8 streaming links
          </p>
        </div>

        <LinkChecker />
      </div>
    </div>
  );
};

export default Index;