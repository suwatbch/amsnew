import type { Metadata } from 'next'
import ImageCropper from './components/ImageCropper'

export const metadata: Metadata = { title: 'Image Crop' }

const ImageCrop = () => {
  return <ImageCropper />
}

export default ImageCrop
