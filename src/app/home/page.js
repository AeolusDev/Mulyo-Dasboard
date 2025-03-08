'use client';
import Image from 'next/image';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { UploadHandler } from '../utils/uploadHandler';
import { Analytics } from "@vercel/analytics/react";
import { FloatingDockUi } from '../components/FloatingDockUI';
import withAuth from '../components/withAuth';
import axios from 'axios';

const Home = () => {
  return (
    <div>
      <div className="top-5 right-10 flex flex-col justify-center items-center py-2">
        {/*Page Title */}
        <div className="relative z-10 p-4 pt-6 ">
          <div className="">
            <div className="flex gap-6">
              <div className="size-auto">
                <div className="card bg-base-100 backdrop-blur-sm
                  shadow-[0_0_30px_rgba(147,51,234,1)] 
                  hover:shadow-[0_0_50px_rgba(147,51,234,0.3)] 
                  transition-all duration-500 ease-out transform hover:-translate-y-2
                  border-2 border-[rgba(147,51,234,1)] backdrop-blur-sm rounded-md size-auto"
                >
                  <div className="card-body">
                    <h2 className="text-xl font-bold text-primary-content m-2">Home</h2>
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingDockUi />
    </div>
  );
}

export default withAuth(Home);