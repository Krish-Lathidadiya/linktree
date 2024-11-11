import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['lh3.googleusercontent.com','res.cloudinary.com'], 
  },
  experimental:{
    serverActions:{
      bodySizeLimit:"5mb"
    }
  }
};

export default nextConfig;
