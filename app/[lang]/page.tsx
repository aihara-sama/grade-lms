const Page = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-500 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-center">
            Learn Anytime, Anywhere
          </h1>
          <p className="text-xl md:text-2xl mt-4 text-center">
            Access live lessons, courses, and resources in real-time, tailored
            to your schedule.
          </p>
          <div className="mt-10 text-center">
            <a
              href="#features"
              className="bg-white text-blue-500 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Real-time Lessons</h3>
              <p className="mt-2 text-gray-600">
                Attend live lessons and interact with instructors in real-time,
                no matter your timezone.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Personalized Schedules</h3>
              <p className="mt-2 text-gray-600">
                Manage your lessons and events with timezone-aware scheduling.
                Never miss a session!
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Push Notifications</h3>
              <p className="mt-2 text-gray-600">
                Get instant notifications for new lessons, assignments, or
                announcements on any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
              <p className="text-lg font-semibold">
                &quot;This platform has changed the way I learn.&quot;
              </p>
              <p className="mt-2 text-gray-600">- John Doe</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
              <p className="text-lg font-semibold">
                &quot;Real-time lessons fit perfectly into my busy
                schedule.&quot;
              </p>
              <p className="mt-2 text-gray-600">- Jane Smith</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
              <p className="text-lg font-semibold">
                &quot;The best way to stay on top of my studies.&quot;
              </p>
              <p className="mt-2 text-gray-600">- Mike Johnson</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-500 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">
            Join Our Learning Platform Today!
          </h2>
          <p className="mt-4 text-xl">
            Sign up for a free account and start learning from industry experts.
          </p>
          <div className="mt-10">
            <a
              href="/auth/register"
              className="bg-white text-blue-500 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-200"
            >
              Sign Up Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="container mx-auto px-6 text-center">
          <p>© 2024 Next.js App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Page;
