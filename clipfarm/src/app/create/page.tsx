"use client";
import Header from '@/components/landing/Header';
import VideoGenerator from '@/components/VideoGenerator';
import { useEffect, useState } from 'react';

export default function ReelGeneratorPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">

      <VideoGenerator />
    </div>
  );
}
