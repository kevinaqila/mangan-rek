const AuthImage = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.tokopedia.net/blog-tokopedia-com/uploads/2018/04/Wisata-Malam-Surabaya-4-Travel-Malang.jpg')",
          filter: "brightness(0.5)",
        }}
      ></div>

      {/* Text Content */}
      <div className="relative z-10 text-center text-white px-15">
        <h2 className="text-2xl font-bold">Ayo Mangan Rek!</h2>
        <p className="text-md mt-2">Memberikan pengalaman kuliner terbaik di Surabaya.</p>
      </div>
    </div>
  );
};

export default AuthImage;
