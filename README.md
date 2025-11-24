# Mangan Rek - Food Places Recommendation App

A full-stack MERN application for discovering and sharing food places in Surabaya.

## 🚀 Features

- User authentication (JWT)
- Place CRUD operations
- Reviews and ratings
- Bookmark system
- Role-based access (User, Contributor, Admin)
- Image uploads (Cloudinary)
- Responsive design
- Real-time search and filtering

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, DaisyUI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Cloudinary
- **Maps**: Leaflet

## 📦 Installation

1. Clone the repository
```bash
git clone https://github.com/kevinaqila/mangan-rek.git
cd mangan-rek
```

2. Install dependencies for both frontend and backend
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables
```bash
# Backend
cp .env.example .env
# Fill in your environment variables
```

4. Start development servers
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

## 🚀 Deployment

### Backend (Railway)
1. Create Railway account
2. Connect your GitHub repo
3. Set environment variables in Railway dashboard
4. Deploy

### Frontend (Vercel)
1. Connect your repo to Vercel
2. Set environment variable: `VITE_API_BASE_URL=https://your-backend-url.up.railway.app`
3. Deploy

### Environment Variables

#### Backend (.env)
```
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PORT=5001
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Frontend (Vercel)
```
VITE_API_BASE_URL=https://your-backend-url.up.railway.app
```

## � Troubleshooting

### "Cannot GET /" (Backend)
✅ **Fixed**: Added root route for health checks

### "Failed to load module script" (Frontend)
- ✅ **Fixed**: Simplified Vercel configuration
- Make sure `vercel.json` uses simple rewrites
- Check that build produces correct assets

### CORS Issues
- Ensure `FRONTEND_URL` is set correctly in backend
- Include both development and production URLs

### Build Errors
- Run `npm run build` locally first
- Check that all dependencies are installed
- Verify Vite configuration

## �📱 Usage

1. Register/Login to access the app
2. Browse food places on the home page
3. Use search and filters to find specific places
4. View place details, read reviews
5. Bookmark places you like
6. Contributors can add new places
7. Leave reviews and ratings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Kevin Aqila**
- GitHub: [@kevinaqila](https://github.com/kevinaqila)
- LinkedIn: [Your LinkedIn]

---

⭐ If you found this project helpful, please give it a star!