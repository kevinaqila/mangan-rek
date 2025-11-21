const Footer = ({ isNavbarOpen }) => {
  return (
    <footer
      className={`transition-all duration-300 ${isNavbarOpen ? "ml-64" : "ml-22"} relative  text-white md:p-10 mt-10`}
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 ml-10">
        {/* Informasi Singkat */}

        <div>
          <div className="flex">
            <img src="/images/logo-navbar-darkmode.png" alt="Logo" className="w-8 h-8 object-contain mr-3" />

            <h3 className="text-lg font-bold mb-4">
              Mangan <span className="text-yellow-500">Rek</span>
            </h3>
          </div>
          <p className="text-gray-400">
            Temukan tempat makan terbaik di sekitarmu dengan Mangan Rek. Kami memberikan rekomendasi kuliner terbaik
            untuk Anda!
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <h3 className="text-lg font-bold mb-4">Navigasi</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-gray-400 hover:text-white">
                Beranda
              </a>
            </li>
            <li>
              <a href="/explore" className="text-gray-400 hover:text-white">
                Jelajahi
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-400 hover:text-white">
                Tentang Kami
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-400 hover:text-white">
                Kontak
              </a>
            </li>
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
          <ul className="flex space-x-4">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <i className="fab fa-facebook-f"></i> Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <i className="fab fa-twitter"></i> Twitter
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <i className="fab fa-instagram"></i> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Mangan Rek. Semua Hak Dilindungi.
      </div>
    </footer>
  );
};

export default Footer;
