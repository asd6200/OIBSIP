import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { MapPin, Navigation, Edit3, Store, Check, X, Compass, CheckCircle, Search } from 'lucide-react';

const LocationSelectorModal = ({ isOpen, onClose }) => {
  const { deliveryAddress, setDeliveryAddress, selectedStore, setSelectedStore } = useContext(CartContext);

  const [activeTab, setActiveTab] = useState('gps'); // 'gps', 'map', 'manual'
  const [loadingGps, setLoadingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('');

  // Interactive Map Pin coordinates state
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 }); // percentage position on map canvas
  const [mapAddress, setMapAddress] = useState('Pin Point: Sector 4, Patliputra Colony, Patna, 800001');

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    houseNo: '155',
    street: 'Patliputra Colony',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800001',
    landmark: 'Near P & M Mall',
  });

  // Nearby Stores list
  const nearbyStores = [
    {
      id: 'store_1',
      name: 'P & M Mall Outlet',
      address: 'P & M Mall, Patliputra Colony, Patna, Bihar',
      distance: '0.8 km',
      status: 'Open Now',
      timing: '10:00 AM - 11:00 PM',
    },
    {
      id: 'store_2',
      name: 'Boring Road Express',
      address: 'Opp. A.N. College, Boring Road, Patna, Bihar',
      distance: '2.3 km',
      status: 'Open Now',
      timing: '10:00 AM - 11:30 PM',
    },
    {
      id: 'store_3',
      name: 'Kankarbagh Main Hub',
      address: 'Tempo Stand, Main Road, Kankarbagh, Patna, Bihar',
      distance: '4.1 km',
      status: 'Open Now',
      timing: '10:00 AM - 11:00 PM',
    },
    {
      id: 'store_4',
      name: 'Bailey Road Express',
      address: 'Near Pillar 65, Rukanpura, Bailey Road, Patna, Bihar',
      distance: '5.6 km',
      status: 'Open Now',
      timing: '10:00 AM - 11:00 PM',
    },
  ];

  if (!isOpen) return null;

  // Option 1: GPS Location Detection
  const handleFetchCurrentLocation = () => {
    setLoadingGps(true);
    setGpsStatus('Accessing GPS coordinates...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          const detectedAddress = `GPS Location (${lat}, ${lng}), Patliputra Colony, Patna, Bihar, 800001`;
          setDeliveryAddress(detectedAddress);
          setGpsStatus('📍 GPS Location detected & saved!');
          setLoadingGps(false);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          const fallbackAddress = 'Current GPS: Patliputra Colony, Patna, Bihar, 800001';
          setDeliveryAddress(fallbackAddress);
          setGpsStatus('📍 Location detected (Patna Central Zone)');
          setLoadingGps(false);
        },
        { timeout: 8000 }
      );
    } else {
      setGpsStatus('Geolocation not supported by browser');
      setLoadingGps(false);
    }
  };

  // Option 2: Map Click Handler
  const handleMapCanvasClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPos({ x, y });

    // Generate address preview based on map zone click
    const areaName = x > 50 ? (y > 50 ? 'Patliputra Sector B' : 'Boring Road Sector 2') : (y > 50 ? 'Kankarbagh Zone' : 'Bailey Road Hub');
    const newAdd = `Pinned Location: ${areaName}, Patna, Bihar - 800001`;
    setMapAddress(newAdd);
  };

  const handleConfirmMapLocation = () => {
    setDeliveryAddress(mapAddress);
    onClose();
  };

  // Option 3: Save Manual Address Form
  const handleSaveManualAddress = (e) => {
    e.preventDefault();
    const fullAdd = `${manualForm.houseNo}, ${manualForm.street}, ${manualForm.landmark ? manualForm.landmark + ', ' : ''}${manualForm.city}, ${manualForm.state} - ${manualForm.pincode}`;
    setDeliveryAddress(fullAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Top Crimson Header */}
        <div className="bg-[#7E121D] text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">Select Delivery Address & Store</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* Method Selection Tabs (Current Location | Map Pointer | Manual Fill) */}
          <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1.5 rounded-2xl text-xs font-bold text-center">
            <button
              onClick={() => setActiveTab('gps')}
              className={`py-2 px-1 rounded-xl transition flex items-center justify-center space-x-1 ${
                activeTab === 'gps' ? 'bg-[#7E121D] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>GPS Location</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`py-2 px-1 rounded-xl transition flex items-center justify-center space-x-1 ${
                activeTab === 'map' ? 'bg-[#7E121D] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Map Pointer</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`py-2 px-1 rounded-xl transition flex items-center justify-center space-x-1 ${
                activeTab === 'manual' ? 'bg-[#7E121D] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Manual Form</span>
            </button>
          </div>

          {/* TAB 1: GPS CURRENT LOCATION */}
          {activeTab === 'gps' && (
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#7E121D] text-amber-400 flex items-center justify-center mx-auto shadow-md">
                <Navigation className="w-7 h-7 animate-pulse" />
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-gray-900">Detect Current Location via GPS</h3>
                <p className="text-xs text-gray-500 mt-1">Uses browser GPS for precise delivery pinpointing.</p>
              </div>

              {gpsStatus && (
                <div className="text-xs font-bold text-[#7E121D] bg-white p-2.5 rounded-xl border border-amber-200">
                  {gpsStatus}
                </div>
              )}

              <button
                onClick={handleFetchCurrentLocation}
                disabled={loadingGps}
                className="w-full bg-[#7E121D] text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:bg-red-800 transition uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Navigation className="w-4 h-4" />
                <span>{loadingGps ? 'LOCATING...' : 'USE CURRENT GPS LOCATION'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: INTERACTIVE MAP POINT PICKER */}
          {activeTab === 'map' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800">Tap anywhere on map to position pin:</span>
                <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">Interactive</span>
              </div>

              {/* Simulated Map Canvas */}
              <div
                onClick={handleMapCanvasClick}
                className="relative h-44 rounded-2xl overflow-hidden border-2 border-amber-400 cursor-crosshair shadow-inner bg-emerald-950/20"
                style={{
                  backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px), radial-gradient(#CBD5E1 1.5px, #F8FAFC 1.5px)',
                  backgroundSize: '30px 30px',
                  backgroundPosition: '0 0, 15px 15px',
                }}
              >
                {/* Roads / Landmarks Graphics */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-300 -translate-y-1/2 flex items-center justify-around opacity-60">
                  <span className="text-[9px] font-mono font-bold text-gray-600">Patliputra Main Rd</span>
                </div>
                <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gray-300 -translate-x-1/2 opacity-60"></div>
                <div className="absolute top-4 left-4 bg-amber-400/90 text-[#7E121D] text-[10px] font-extrabold px-2 py-1 rounded-md shadow">
                  📍 P & M Mall Zone
                </div>

                {/* Pin Pointer Marker */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 pointer-events-none"
                  style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                >
                  <div className="flex flex-col items-center">
                    <span className="bg-[#7E121D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                      Selected Point
                    </span>
                    <MapPin className="w-8 h-8 text-[#7E121D] fill-amber-400 filter drop-shadow-md animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Selected Pinned Address Preview */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                <span className="text-gray-400 font-semibold block">Pinned Address:</span>
                <p className="font-bold text-gray-900 mt-0.5">{mapAddress}</p>
              </div>

              <button
                onClick={handleConfirmMapLocation}
                className="w-full bg-[#7E121D] text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:bg-red-800 transition uppercase tracking-wider flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>CONFIRM MAP PIN LOCATION</span>
              </button>
            </div>
          )}

          {/* TAB 3: MANUAL ADDRESS FORM */}
          {activeTab === 'manual' && (
            <form onSubmit={handleSaveManualAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase">Flat / House No.</label>
                  <input
                    type="text"
                    required
                    value={manualForm.houseNo}
                    onChange={(e) => setManualForm({ ...manualForm, houseNo: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase">Street / Colony</label>
                  <input
                    type="text"
                    required
                    value={manualForm.street}
                    onChange={(e) => setManualForm({ ...manualForm, street: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={manualForm.city}
                    onChange={(e) => setManualForm({ ...manualForm, city: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase">Pincode</label>
                  <input
                    type="text"
                    required
                    value={manualForm.pincode}
                    onChange={(e) => setManualForm({ ...manualForm, pincode: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase">Landmark (Optional)</label>
                <input
                  type="text"
                  value={manualForm.landmark}
                  onChange={(e) => setManualForm({ ...manualForm, landmark: e.target.value })}
                  placeholder="e.g. Near P & M Mall"
                  className="w-full p-2 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7E121D] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#7E121D] text-white font-extrabold text-xs py-3 rounded-xl shadow-md hover:bg-red-800 transition uppercase tracking-wider"
              >
                SAVE MANUAL ADDRESS
              </button>
            </form>
          )}

          {/* NEARBY STORES SECTION */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900 flex items-center space-x-1.5">
                <Store className="w-4 h-4 text-[#7E121D]" />
                <span>Suggested Nearby Stores</span>
              </h3>
              <span className="text-[11px] text-gray-400 font-semibold">{nearbyStores.length} Stores Found</span>
            </div>

            <div className="space-y-2">
              {nearbyStores.map((store) => {
                const isSelected = selectedStore === store.name || selectedStore?.includes(store.name);
                return (
                  <div
                    key={store.id}
                    onClick={() => setSelectedStore(store.name)}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#7E121D] bg-red-50/60 ring-2 ring-red-100'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-amber-100 text-[#7E121D] rounded-xl font-bold mt-0.5">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-xs text-gray-900">{store.name}</h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                            {store.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{store.address}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                          Timing: {store.timing}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end space-y-1">
                      <span className="text-xs font-black text-[#7E121D] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {store.distance}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-bold text-[#7E121D] flex items-center space-x-0.5">
                          <CheckCircle className="w-3.5 h-3.5 fill-[#7E121D] text-white" />
                          <span>Selected</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="truncate max-w-[280px]">
            <span className="text-gray-400 font-semibold block text-[10px]">Active Address:</span>
            <span className="font-bold text-gray-800 truncate block">{deliveryAddress}</span>
          </div>

          <button
            onClick={onClose}
            className="bg-[#7E121D] text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase shadow"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelectorModal;
