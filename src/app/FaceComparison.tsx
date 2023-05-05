'use client';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { ClipLoader } from 'react-spinners';
import '@tensorflow/tfjs';

const FaceComparison: React.FC = () => {
  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<string | null>(null);
  const [colorResult, setColorResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview1, setImagePreview1] = useState<string | null>(null);
  const [imagePreview2, setImagePreview2] = useState<string | null>(null);

  async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  }

  function updateImagePreview(inputRef: React.RefObject<HTMLInputElement>, setImagePreview: React.Dispatch<React.SetStateAction<string | null>>) {
    if (inputRef.current?.files) {
      const imageUrl = URL.createObjectURL(inputRef.current.files[0]);
      setImagePreview(imageUrl);
    }
  }

  async function compareFaces() {
    setLoading(true);
    try {
      await loadModels();

      if (inputRef1.current?.files && inputRef2.current?.files) {
        const imageUrl1 = URL.createObjectURL(inputRef1.current.files[0]);
        const imageUrl2 = URL.createObjectURL(inputRef2.current.files[0]);

        const image1 = await faceapi.fetchImage(imageUrl1);
        const image2 = await faceapi.fetchImage(imageUrl2);

        const detection1 = await faceapi.detectSingleFace(image1);
        const detection2 = await faceapi.detectSingleFace(image2);

        if (!detection1 || !detection2) {
          setResult('Não foi possível detectar rostos nas imagens');
          setLoading(false);
          return;
        }

        const descriptor1 = await faceapi.computeFaceDescriptor(image1);
        const descriptor2 = await faceapi.computeFaceDescriptor(image2);

        const distance = faceapi.euclideanDistance(descriptor1 as any, descriptor2 as any);
        console.log(distance);
        setResult(distance < 0.5 ? 'As faces são iguais' : 'As faces são diferentes');
        setColorResult(distance < 0.5 ? 'green' : 'red');
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex space-x-4 mt-4">
        {imagePreview1 && (
          <div className="w-1/2">
            <h3 className="text-center mb-2">Face 1</h3>
            <Image src={imagePreview1} alt="Preview imagem 1" width={300} height={300} style={{
              objectFit: 'cover'
            }} />
          </div>
        )}
        {imagePreview2 && (
          <div className="w-1/2">
            <h3 className="text-center mb-2">Face 2</h3>
            <Image src={imagePreview2} alt="Preview imagem 2" width={300} height={300} style={{
              objectFit: 'cover'
            }} />
          </div>
        )}
      </div>
      <div className="flex space-x-5 mt-4">
        <input
          ref={inputRef1}
          className='mb-4'
          type="file"
          accept="image/*"
          onChange={() => updateImagePreview(inputRef1, setImagePreview1)}
        />
        <input
          ref={inputRef2}
          className='mb-4'
          type="file"
          accept="image/*"
          onChange={() => updateImagePreview(inputRef2, setImagePreview2)}
        />
      </div>
      <div className="flex justify-center">
        <button
          className={`
          inline-flex
          items-center
          px-4
          py-2
          text-sm
          font-semibold
          leading-6
          text-white
          transition
          duration-150
          ease-in-out
          bg-indigo-500
          rounded-md
          shadow
          hover:bg-indigo-400
          disabled:opacity-50
          `}
          onClick={compareFaces}
          disabled={loading}
        >
          <div className="flex items-center space-x-2">
            {loading && (
              <ClipLoader
                size={20}
                color={'#fff'}
              />
            )}
            {loading ? 'Comparando' : 'Comparar'}
          </div>
        </button>
      </div>
      {result &&
        (<div className={`
        border-2
        ${colorResult === 'green' ? 'border-green-500' : 'border-red-500'}
        rounded
        p-4
        mt-4
        `}>
          <p className={`
        text-center
        text-2xl
        font-bold
        ${colorResult === 'green' ? 'text-green-500' : 'text-red-500'}
        `}>
            {result}
          </p>
        </div>
        )}
    </div>
  );
};

export default FaceComparison;