"use client"
import Image from 'next/image';
import { FaSkull } from 'react-icons/fa';
import { FloatingDockUi } from '../components/FloatingDockUI';
import withAuth from '../components/withAuth';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-base-100 relative overflow-hidden" data-theme="dark">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base black background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Grid with radial fade */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 1) 1px, transparent 1px),
                linear-gradient(rgba(147, 51, 234, 1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.5) 1px, transparent 5px)
              `,
              backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
              mask: 'radial-gradient(circle at center, transparent 0%, black 70%)',
              WebkitMask: 'radial-gradient(circle, rgba(106,45,194,0.3939776594231442) 100%, rgba(0,0,0,0.7637255585828081) 90%)',
              opacity: '0.4'
            }}
          />
        </div>

        {/* Subtle purple accent glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.0003) 10%, transparent 30%)',
            filter: 'blur(5px)'
          }}
        />
      </div>
      
      <div>
        <div className="top-5 right-10 flex flex-col justify-center items-center py-2">
          
          {/* Page Title */}
          <div className="relative z-10 p-4 pt-6">
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
                      <h2 className="text-xl font-bold text-primary-content m-2">Settings</h2>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 p-4 pt-6">
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
                      
                    </div>
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

export default withAuth(SettingsPage);