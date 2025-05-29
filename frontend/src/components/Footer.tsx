const Footer = () => {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-2xl font-bold">
              Agro<span className="text-green-400">Smart</span>
            </h3>
          </div>
          
          <nav className="flex space-x-8">
            <a 
              href="#" 
              className="text-gray-300 hover:text-green-400 transition-colors duration-300"
            >
              About
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-green-400 transition-colors duration-300"
            >
              Help
            </a>
            <a 
              href="#" 
              className="text-gray-300 hover:text-green-400 transition-colors duration-300"
            >
              Contact
            </a>
          </nav>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 AgroSmart. Building the future of agriculture.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;