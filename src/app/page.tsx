'use client';

import { useState } from 'react'
import { supabase } from './utils/supabase'  // Note the updated import path

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    artifact_id: '',
    values_beliefs: 0,
    aesthetic_elements: 0,
    communication_styles: 0,
    notes: ''
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image) return

    setLoading(true)
    try {
      // Upload image to Supabase Storage
      const fileName = `${Date.now()}-${image.name}`
      const { error: uploadError } = await supabase.storage
        .from('cultural-signatures')
        .upload(fileName, image)

      if (uploadError) throw uploadError

      // Save signature data to database
      const { error: dbError } = await supabase
        .from('cultural_signatures')
        .insert([{
          ...formData,
          artifact_id: fileName
        }])

      if (dbError) throw dbError

      // Reset form
      setImage(null)
      setPreview('')
      setFormData({
        artifact_id: '',
        values_beliefs: 0,
        aesthetic_elements: 0,
        communication_styles: 0,
        notes: ''
      })

      alert('Successfully saved cultural signature!')
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving cultural signature')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Cultural Signatures Tagger</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 object-contain"
            />
          )}
        </div>

        {/* Rating Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Values & Beliefs (0-2)
            </label>
            <input
              type="number"
              min={0}
              max={2}
              value={formData.values_beliefs}
              onChange={(e) => setFormData({
                ...formData,
                values_beliefs: parseInt(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Aesthetic Elements (0-2)
            </label>
            <input
              type="number"
              min={0}
              max={2}
              value={formData.aesthetic_elements}
              onChange={(e) => setFormData({
                ...formData,
                aesthetic_elements: parseInt(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Communication Styles (0-2)
            </label>
            <input
              type="number"
              min={0}
              max={2}
              value={formData.communication_styles}
              onChange={(e) => setFormData({
                ...formData,
                communication_styles: parseInt(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({
              ...formData,
              notes: e.target.value
            })}
            className="w-full p-2 border rounded h-32"
            placeholder="Enter any additional observations..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !image}
          className={`w-full py-2 px-4 rounded text-white font-medium
            ${loading || !image 
              ? 'bg-gray-400' 
              : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? 'Saving...' : 'Save Cultural Signature'}
        </button>
      </form>
    </main>
  )
}