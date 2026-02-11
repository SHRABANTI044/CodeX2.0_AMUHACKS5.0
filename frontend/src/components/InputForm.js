import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createUser } from '../api';

const InputForm = () => {
  const [name, setName] = useState('');
  const [dailyStudyHours, setDailyStudyHours] = useState('');
  const [stressLevel, setStressLevel] = useState('Low');
  const [subjects, setSubjects] = useState([
    { subjectName: '', deadline: null, completionPercentage: '', difficulty: 1 }
  ]);
  const navigate = useNavigate();

  const addSubject = () => {
    setSubjects([...subjects, { subjectName: '', deadline: null, completionPercentage: '', difficulty: 1 }]);
  };

  const updateSubject = (index, field, value) => {
    const updatedSubjects = subjects.map((subject, i) =>
      i === index ? { ...subject, [field]: value } : subject
    );
    setSubjects(updatedSubjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      name,
      dailyStudyHours: parseInt(dailyStudyHours),
      stressLevel,
      subjects
    };

    try {
      const response = await createUser(userData);
      navigate(`/dashboard/${response._id}`);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-8">Create Your Recovery Plan</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Daily Study Hours</label>
                    <input
                      type="number"
                      value={dailyStudyHours}
                      onChange={(e) => setDailyStudyHours(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stress Level</label>
                    <select
                      value={stressLevel}
                      onChange={(e) => setStressLevel(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Subjects</h3>
                    {subjects.map((subject, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                            <input
                              type="text"
                              value={subject.subjectName}
                              onChange={(e) => updateSubject(index, 'subjectName', e.target.value)}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Deadline</label>
                            <DatePicker
                              selected={subject.deadline}
                              onChange={(date) => updateSubject(index, 'deadline', date)}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Completion %</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={subject.completionPercentage}
                              onChange={(e) => updateSubject(index, 'completionPercentage', e.target.value)}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Difficulty (1-5)</label>
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={subject.difficulty}
                              onChange={(e) => updateSubject(index, 'difficulty', e.target.value)}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addSubject}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Subject
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Generate Recovery Plan
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
