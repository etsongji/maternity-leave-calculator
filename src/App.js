import React, { useState } from 'react';
import { Calendar, Baby, Users, Heart, Calculator } from 'lucide-react';
import './App.css';

const MaternityLeaveCalculator = () => {
  const [expectedDate, setExpectedDate] = useState('');
  const [birthType, setBirthType] = useState('single');
  const [desiredEndDate, setDesiredEndDate] = useState('');
  const [useCustomEndDate, setUseCustomEndDate] = useState(false);
  const [result, setResult] = useState(null);

  const calculateMaternityLeave = () => {
    if (!expectedDate) {
      alert('출산예정일을 선택해주세요.');
      return;
    }

    if (useCustomEndDate && !desiredEndDate) {
      alert('원하는 휴가 종료일을 선택해주세요.');
      return;
    }

    const dueDate = new Date(expectedDate);
    let totalDays = 90;
    let postBirthDays = 45;

    switch (birthType) {
      case 'multiple':
        totalDays = 120;
        postBirthDays = 60;
        break;
      case 'premature':
        totalDays = 100;
        postBirthDays = 45;
        break;
      default:
        totalDays = 90;
        postBirthDays = 45;
    }

    let startDate, endDate;
    let isCustomEndDateUsed = false;

    if (useCustomEndDate && desiredEndDate) {
      const customEndDate = new Date(desiredEndDate);
      const calculatedStartDate = new Date(customEndDate);
      calculatedStartDate.setDate(customEndDate.getDate() - totalDays + 1);
      
      const minEndDate = new Date(dueDate);
      minEndDate.setDate(dueDate.getDate() + postBirthDays - 1);
      
      if (customEndDate >= minEndDate) {
        startDate = calculatedStartDate;
        endDate = customEndDate;
        isCustomEndDateUsed = true;
      } else {
        alert(`선택한 종료일이 너무 이릅니다.\n출산예정일(${dueDate.toLocaleDateString('ko-KR')}) 이후 최소 ${postBirthDays}일의 산후 휴가가 필요합니다.\n최소 종료일: ${minEndDate.toLocaleDateString('ko-KR')}`);
        return;
      }
    } else {
      const preBirthDays = totalDays - postBirthDays;
      startDate = new Date(dueDate);
      startDate.setDate(dueDate.getDate() - preBirthDays);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + totalDays - 1);
    }

    setResult({
      totalDays,
      postBirthDays,
      preBirthDays: totalDays - postBirthDays,
      startDate,
      endDate,
      dueDate,
      isCustomEndDateUsed
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    });
  };

  const handleEndDateChange = (value) => {
    setDesiredEndDate(value);
    setResult(null);
  };

  const handleUseCustomEndDateChange = (checked) => {
    setUseCustomEndDate(checked);
    setDesiredEndDate('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">출산휴가 계산기</h1>
          </div>
          <p className="text-gray-600">여성 교육공무원을 위한 출산휴가 기간 계산기</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                <Calendar className="w-5 h-5 inline mr-2" />
                출산예정일
              </label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => {
                  setExpectedDate(e.target.value);
                  setResult(null);
                }}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">출산 유형</label>
              <div className="space-y-3">
                {[
                  { value: 'single', label: '단태아', days: '90일', icon: Baby, desc: '일반적인 단일 출산' },
                  { value: 'multiple', label: '다태아', days: '120일', icon: Users, desc: '쌍둥이, 삼둥이 등' },
                  { value: 'premature', label: '미숙아', days: '100일', icon: Heart, desc: '미숙아 출산' }
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        birthType === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="birthType"
                        value={option.value}
                        checked={birthType === option.value}
                        onChange={(e) => {
                          setBirthType(e.target.value);
                          setResult(null);
                        }}
                        className="sr-only"
                      />
                      <Icon className={`w-6 h-6 mr-3 ${birthType === option.value ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-800 mr-2">{option.label}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            birthType === option.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {option.days}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">{option.desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start mb-3">
                <input
                  type="checkbox"
                  id="useCustomEndDate"
                  checked={useCustomEndDate}
                  onChange={(e) => handleUseCustomEndDateChange(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-2 border-amber-300 rounded focus:ring-blue-500 mt-1"
                />
                <label htmlFor="useCustomEndDate" className="ml-3 text-sm font-medium text-amber-800">
                  휴가 종료일 직접 설정
                  <div className="text-xs text-amber-600 mt-1">
                    방학 종료일, 학기 시작일 등에 맞춰 조정할 수 있습니다
                  </div>
                </label>
              </div>
              
              {useCustomEndDate && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-amber-700 mb-2">
                    원하는 휴가 종료일
                  </label>
                  <input
                    type="date"
                    value={desiredEndDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full p-3 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200"
                  />
                  {desiredEndDate && (
                    <div className="mt-2 p-2 bg-amber-100 rounded text-xs text-amber-700">
                      ✓ 설정된 종료일: {new Date(desiredEndDate).toLocaleDateString('ko-KR')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={calculateMaternityLeave}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Calculator className="w-5 h-5 mr-2" />
              출산휴가 계산하기
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">출산휴가 안내</h3>
            <div className="space-y-3 text-sm text-blue-700">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div><strong>기본 기간:</strong> 출산 전후 90일 (단태아)</div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div><strong>다태아:</strong> 120일 (쌍둥이, 삼둥이 등)</div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div><strong>미숙아:</strong> 100일</div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div><strong>산후 휴가:</strong> 출산 후 최소 45일 (다태아 60일) 확보 필수</div>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {result.isCustomEndDateUsed ? '맞춤 설정 결과' : '자동 계산 결과'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">출산예정일:</span>
                    <span className="font-semibold text-blue-600">{formatDate(result.dueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">출산 유형:</span>
                    <span className="font-semibold text-purple-600">
                      {birthType === 'single' ? '단태아' : birthType === 'multiple' ? '다태아' : '미숙아'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">총 휴가 일수:</span>
                    <span className="font-bold text-green-600 text-xl">{result.totalDays}일</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">휴가 기간</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">산전 휴가:</span>
                    <span className="font-semibold text-orange-600">{result.preBirthDays}일</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">산후 휴가:</span>
                    <span className="font-semibold text-pink-600">{result.postBirthDays}일</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">출산휴가 일정</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 border-l-4 ${result.isCustomEndDateUsed ? 'bg-amber-50 border-amber-500' : 'bg-green-50 border-green-500'}`}>
                  <div className={`text-sm font-medium mb-1 ${result.isCustomEndDateUsed ? 'text-amber-700' : 'text-green-700'}`}>
                    휴가 시작일 {result.isCustomEndDateUsed ? '(맞춤 설정)' : '(가장 빨리)'}
                  </div>
                  <div className={`text-lg font-bold ${result.isCustomEndDateUsed ? 'text-amber-800' : 'text-green-800'}`}>
                    {formatDate(result.startDate)}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="text-sm text-blue-700 font-medium mb-1">
                    휴가 종료일 {result.isCustomEndDateUsed ? '(설정됨)' : '(자동계산)'}
                  </div>
                  <div className="text-lg font-bold text-blue-800">{formatDate(result.endDate)}</div>
                </div>
              </div>
              
              {result.isCustomEndDateUsed && (
                <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    ✅ 원하는 종료일에 맞춰 휴가 일정이 조정되었습니다.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">📋 주의사항</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• {result.isCustomEndDateUsed ? '종료일이 조정된 ' : '출산 후 최소 휴가 기간을 보장하는 '}휴가 일정입니다.</li>
                <li>• 실제 출산일이 예정일과 다를 경우 휴가 기간이 조정될 수 있습니다.</li>
                <li>• 산후 최소 {result.postBirthDays}일은 반드시 확보되어야 합니다.</li>
                <li>• 구체적인 휴가 신청은 소속 기관의 규정을 확인하시기 바랍니다.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <MaternityLeaveCalculator />
    </div>
  );
}

export default App;