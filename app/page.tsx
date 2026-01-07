// app/page.tsx
import { 
  SignedIn, 
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton 
} from '@clerk/nextjs';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to MyApp</h1>
      
      {/* Show authentication UI for signed OUT users */}
      <SignedOut>
        <div className="space-y-6 text-center">
          <p className="text-lg mb-6">Please sign in to continue</p>
          
          {/* Clerk's sign-in/sign-up interface will appear when clicked */}
          <div className="space-y-4">
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
            
            <div className="text-sm text-gray-600">or</div>
            
            <SignUpButton mode="modal">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Create Account
              </button>
            </SignUpButton>
          </div>
        </div>
      </SignedOut>
      
      {/* Show user info for signed IN users */}
      <SignedIn>
        <div className="text-center space-y-6">
          <p className="text-xl">You're successfully signed in!</p>
          <div className="flex justify-center">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-12 h-12"
                }
              }}
            />
          </div>
        </div>
      </SignedIn>
    </div>
  );
}