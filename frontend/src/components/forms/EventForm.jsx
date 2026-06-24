import { motion } from 'framer-motion'
import SelectField from './SelectField.jsx'
import SliderField from './SliderField.jsx'
import CheckboxGroup from './CheckboxGroup.jsx'
import Button from '../common/Button.jsx'
import {
  eventCategories, registrationMethods, certificateTypes,
  marketingTypes, transportTypes, waterTypes, foodTypes,
  energyLevels, wasteOptions, sustainabilityInitiatives
} from '../../data/eventCategories.js'
import { useAnalysis } from '../../context/AnalysisContext.jsx'
import { FiUsers, FiCalendar, FiMapPin, FiClock, FiTag, FiZap } from 'react-icons/fi'

export default function EventForm({ onSubmit, loading = false }) {
  const { formData, updateField, resetForm, loadForm } = useAnalysis()

  const handleChange = (field, value) => {
    updateField(field, value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) onSubmit(formData)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Event Details Section */}
      <div className="rounded-2xl bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-eco-500/10 flex items-center justify-center text-sm">📋</span>
          Event Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Name *</label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => handleChange('eventName', e.target.value)}
              placeholder="e.g., GreenTech Summit 2026"
              required
              className="w-full px-4 py-3 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all text-sm backdrop-blur-sm placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization *</label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              placeholder="e.g., University of Green"
              required
              className="w-full px-4 py-3 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all text-sm backdrop-blur-sm placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FiMapPin className="w-4 h-4" /> Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., New York, NY"
              required
              className="w-full px-4 py-3 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all text-sm backdrop-blur-sm placeholder-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FiCalendar className="w-4 h-4" /> Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/50 dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-eco-500/50 focus:border-eco-500 transition-all text-sm backdrop-blur-sm"
            />
          </div>

          <SliderField
            label="Expected Participants"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            min={10}
            max={50000}
            step={10}
            icon={<FiUsers className="w-4 h-4" />}
          />

          <SliderField
            label="Duration (days)"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min={0.5}
            max={30}
            step={0.5}
            suffix=" days"
            icon={<FiClock className="w-4 h-4" />}
          />

          <SelectField
            label="Event Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            options={eventCategories}
            icon={<FiTag className="w-4 h-4" />}
            placeholder="Select category"
          />
        </div>
      </div>

      {/* Sustainability Assessment Section */}
      <div className="rounded-2xl bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-eco-500/10 flex items-center justify-center text-sm">🌱</span>
          Sustainability Assessment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <SelectField label="Registration Method" name="registration" value={formData.registration} onChange={handleChange} options={registrationMethods} />
          <SelectField label="Certificates" name="certificates" value={formData.certificates} onChange={handleChange} options={certificateTypes} />
          <SelectField label="Marketing" name="marketing" value={formData.marketing} onChange={handleChange} options={marketingTypes} />
          <SelectField label="Transportation" name="transport" value={formData.transport} onChange={handleChange} options={transportTypes} />
          <SelectField label="Water Distribution" name="water" value={formData.water} onChange={handleChange} options={waterTypes} />
          <SelectField label="Food Serving" name="food" value={formData.food} onChange={handleChange} options={foodTypes} />
          <SelectField label="Energy Usage" name="energy" value={formData.energy} onChange={handleChange} options={energyLevels} />
          <SelectField label="Waste Segregation" name="wasteSegregation" value={formData.wasteSegregation} onChange={handleChange} options={wasteOptions} />
        </div>
      </div>

      {/* Sustainability Initiatives */}
      <div className="rounded-2xl bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 p-6 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-eco-500/10 flex items-center justify-center text-sm">♻️</span>
          Sustainability Initiatives
        </h2>
        <CheckboxGroup
          label="Select initiatives you plan to implement"
          name="initiatives"
          options={sustainabilityInitiatives}
          selected={formData.initiatives}
          onChange={(name, val) => handleChange(name, val)}
        />
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Each initiative selected increases your overall sustainability score.
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" loading={loading}>
          🌿 Analyze Sustainability
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => {
            loadForm({
              eventName: formData.eventName || '',
              organization: formData.organization || '',
              location: formData.location || '',
              date: formData.date || '',
              participants: formData.participants || 100,
              duration: formData.duration || 1,
              category: formData.category || 'conference',
              registration: 'digital',
              certificates: 'digital',
              marketing: 'social-media',
              transport: 'carpool',
              water: 'refill-stations',
              food: 'biodegradable',
              energy: 'low',
              wasteSegregation: 'available',
              initiatives: ['solar-power', 'digital-invitations', 'tree-plantation', 'waste-recycling', 'carbon-offset', 'community-awareness', 'reusable-decorations', 'plastic-free'],
            })
          }}
        >
          <FiZap className="w-4 h-4" /> Optimize with AI
        </Button>
        <Button type="button" variant="ghost" onClick={resetForm}>
          Reset Form
        </Button>
      </div>
    </motion.form>
  )
}
