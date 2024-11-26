import type { Metadata } from 'next'
import React from 'react'
import AllFileUploads from './components/AllFileUploads'

export const metadata: Metadata = { title: 'File Uploads' }

const FileUploader = () => {
  return <AllFileUploads />
}

export default FileUploader
