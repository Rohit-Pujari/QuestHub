'use client'
import React from 'react'

interface FileUploadProps {
    progress: number;
    setFile: React.Dispatch<React.SetStateAction<File | null>>
}

const FileUpload: React.FC<FileUploadProps> = ({ progress, setFile }) => {
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        setFile(e.target.files[0])
    }
    const getProgressColor = (progress: number) => {
        if (progress < 30) return "bg-red-500";
        if (progress < 70) return "bg-yellow-500";
        return "bg-green-500";
    };
    return (
        <section className='flex flex-col mb-4 gap-1'>
            <label className='text-lg  font-semibold text-white mb-1'>Media (Image/Video)</label>
            <input className='text-white' type="file" accept='image/*, video/*' onChange={onFileChange} />
            {progress > 0 && (
                <div className="w-full h-6 bg-gray-200 overflow-hidden border rounded-full border-gray-300 mt-2">
                    <div
                        className={`h-full ${getProgressColor(progress)} flex justify-center items-center text-sm font-light transition-all duration-300 `}
                        style={{ width: `${progress}%` }}
                    >
                        {progress}%
                    </div>
                </div>
            )}

        </section>
    )
}

export default FileUpload