"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Users, X, ChevronLeft, Send } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  /*const [showModal, setShowModal] = useState(false);*/
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-blue-600 shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/front/2.png" width={500} height={460} alt="logo" className="h-8 w-auto" />
                <span className="text-xl font-bold text-white">Travelo</span>
              </Link>
            </div>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-orange-300 transition-colors">Home</Link>
              <Link href="/#services" className="text-white hover:text-orange-300 transition-colors">Services</Link>
              <Link href="/#features" className="text-white hover:text-orange-300 transition-colors">Features</Link>
              <Link href="/#about" className="text-white hover:text-orange-300 transition-colors">About</Link>

              {/* Chat Button */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center space-x-1 text-white hover:text-orange-300 transition-colors"
              >
                <MessageCircle size={20} />
                <span>Chat AI</span>
              </button>

              {/* Blog Button */}
              <button
                onClick={() => setIsBlogOpen(true)}
                className="flex items-center space-x-1 text-white hover:text-orange-300 transition-colors"
              >
                <Users size={20} />
                <span>Blog</span>
              </button>

              <button
                onClick={() => {
                  router.push("/auth/login");
                }}
                className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Log in
              </button>
            </div>

            {/* Hamburger Menu */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-orange-300"
              >
                <div className="space-y-2">
                  <span className="block w-6 h-0.5 bg-current"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                  <span className="block w-6 h-0.5 bg-current"></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-white hover:text-orange-300 transition-colors">Home</Link>
              <Link href="/#services" className="block px-3 py-2 text-white hover:text-orange-300 transition-colors">Services</Link>
              <Link href="/#features" className="block px-3 py-2 text-white hover:text-orange-300 transition-colors">Features</Link>
              <Link href="/#about" className="block px-3 py-2 text-white hover:text-orange-300 transition-colors">About</Link>
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full text-left px-3 py-2 text-white hover:text-orange-300 transition-colors"
              >
                Chat AI
              </button>
              <button
                onClick={() => setIsBlogOpen(true)}
                className="w-full text-left px-3 py-2 text-white hover:text-orange-300 transition-colors"
              >
                Blog
              </button>
       <button
                onClick={() => {
                  router.push("/auth/login");
                }}
                className="block px-3 py-2 text-white hover:text-orange-300 transition-colors"
              >
                Log in
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Chat Interface */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center space-x-2">
                <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-blue-700 rounded-full">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold">Chat avec AI</h2>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-blue-700 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Chat Sidebar */}
            <div className="flex h-full">
              <div className="w-64 border-r bg-blue-50 p-4 hidden md:block">
                <h3 className="text-sm font-semibold text-blue-900 mb-4"> Chats recents</h3>
                <div className="space-y-2">
                  {["Planning de voyages", "Les sites touristiques", "Informations sur les agences de transport"].map((chat, index) => (
                    <div key={index} className="p-3 rounded-lg hover:bg-blue-100 cursor-pointer">
                      <p className="text-sm font-medium text-blue-800">{chat}</p>
                      <p className="text-xs text-blue-600">il y&apos;a 02 heures</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Main Area */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex justify-start">
                      <div className="bg-blue-50 rounded-lg p-3 max-w-[80%]">
                        <p className="text-sm text-blue-900">Bonjour comment puis je vous aidez avec vos plans de voyages aujourd hui?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Entrer votre message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blog Interface */}
      {isBlogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl flex flex-col">
            {/* Blog Header */}
            <div className="p-4 border-b flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center space-x-2">
                <button onClick={() => setIsBlogOpen(false)} className="p-2 hover:bg-blue-700 rounded-full">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold">Travelo Blog</h2>
              </div>
              <button onClick={() => setIsBlogOpen(false)} className="p-2 hover:bg-blue-700 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* Blog Content */}
            <div className="flex h-full">
              <div className="w-64 border-r bg-blue-50 p-4 hidden md:block">
                <h3 className="text-sm font-semibold text-blue-900 mb-4">Sites populaires</h3>
                <div className="space-y-2">
                  {["Meilleurs plages", "Découvertes culturelles", "Les villes populaires"].map((topic, index) => (
                    <div key={index} className="p-3 rounded-lg hover:bg-blue-100 cursor-pointer">
                      <p className="text-sm font-medium text-blue-800">{topic}</p>
                      <p className="text-xs text-blue-600">32 discussions</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:bg-blue-50">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-blue-900">John Doe</p>
                          <p className="text-xs text-blue-600">il y a 02 heures</p>
                        </div>
                      </div>
                      <p className="text-sm text-blue-800">les magnifiques plages de Kribi vous sont recommandées..</p>
                    </div>
                  </div>
                </div>

                {/* Blog Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="partager vos experiences de voyages..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;