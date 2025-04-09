export default function ChatbotLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex space-x-3">
            <div className="h-4 w-4 bg-blue-600 dark:bg-blue-500 rounded-full animate-bounce"></div>
            <div className="h-4 w-4 bg-purple-600 dark:bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-4 w-4 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading AI chatbot...</p>
      </div>
    </div>
  );
} 