import { Car, Bed, Utensils, GlassWater, Building2, Stethoscope, FileWarning, Bot, User, ShieldCheck, Hand, HeartHandshake, Truck } from 'lucide-react';
import React from 'react';

export const MAP_MARKERS: { [key: string]: { position: [number, number], name: string, type: string } } = {
  user: { position: [23.182, 75.768], name: "Your Location", type: 'user' },
  mahakaleshwar: { position: [23.1815, 75.7668], name: "Mahakaleshwar Temple", type: 'temple' },
  ramGhat: { position: [23.185, 75.765], name: "Ram Ghat", type: 'ghat' },
  harsiddhi: { position: [23.180, 75.765], name: "Harsiddhi Temple", type: 'temple' },
  policeStation1: { position: [23.183, 75.769], name: "Police Station - Zone A", type: 'police' },
  policeStation2: { position: [23.179, 75.764], name: "Police Station - Zone B", type: 'police' },
  ambulance1: { position: [23.184, 75.764], name: "Ambulance Point 1", type: 'ambulance' },
  ambulance2: { position: [23.180, 75.768], name: "Ambulance Point 2", type: 'ambulance' },
  waterStation1: { position: [23.1825, 75.7675], name: 'Water Station A', type: 'amenity' },
  foodStall1: { position: [23.1848, 75.7652], name: 'Food Stall - River Side', type: 'amenity' },
};

export const PREDEFINED_USER_ROUTES: { [key: string]: { [key: string]: { name: string, description: string, color: string, path: [number, number][] } } } = {
    mahakaleshwar: {
        ai: {
            name: 'aiRecommendedRouteName',
            description: 'aiRecommendedRouteDesc',
            color: '#3b82f6',
            path: [
                [23.182, 75.768],
                [23.181, 75.768],
                [23.181, 75.767],
                [23.1815, 75.7668]
            ]
        },
        shortest: {
            name: 'shortestPathRouteName',
            description: 'shortestPathRouteDesc',
            color: '#8b5cf6',
            path: [
                [23.182, 75.768],
                [23.1822, 75.7675],
                [23.1818, 75.767],
                [23.1815, 75.7668]
            ]
        }
    },
    ramGhat: {
        ai: {
            name: 'aiRecommendedRouteName',
            description: 'saferPathDesc',
            color: '#3b82f6',
            path: [ // Longer, more scenic route that crosses the bridge
                [23.182, 75.768],      // Start
                [23.1835, 75.768],     // North to bridge road
                [23.1835, 75.7645],    // Cross bridge
                [23.185, 75.7645],     // North along river road
                [23.185, 75.765]       // Arrive at Ram Ghat
            ]
        },
        shortest: {
            name: 'shortestPathRouteName',
            description: 'directPathDesc',
            color: '#8b5cf6',
            path: [ // Direct route crossing the bridge
                [23.182, 75.768],      // Start
                [23.183, 75.768],      // North
                [23.183, 75.765],      // Cross bridge
                [23.185, 75.765]       // Arrive at Ram Ghat
            ]
        }
    },
    harsiddhi: {
        ai: {
            name: 'aiRecommendedRouteName',
            description: 'saferPathDesc',
            color: '#3b82f6',
            path: [ // Route using bridge and main roads
                [23.182, 75.768],      // Start
                [23.1835, 75.768],     // North to bridge road
                [23.1835, 75.7645],    // Cross bridge
                [23.18, 75.7645],      // South along main road
                [23.180, 75.765]       // Arrive at Harsiddhi Temple
            ]
        },
        shortest: {
            name: 'shortestPathRouteName',
            description: 'directPathDesc',
            color: '#8b5cf6',
            path: [ // More direct route using bridge
                [23.182, 75.768],      // Start
                [23.183, 75.768],      // North
                [23.183, 75.765],      // Cross bridge
                [23.180, 75.765]       // South to Harsiddhi Temple
            ]
        }
    },
    foodStall1: { // Same path as Ram Ghat, ending slightly different
        ai: {
            name: 'aiRecommendedRouteName',
            description: 'saferPathDesc',
            color: '#3b82f6',
            path: [
                [23.182, 75.768],
                [23.1835, 75.768],
                [23.1835, 75.7645],
                [23.1848, 75.7645],
                [23.1848, 75.7652]
            ]
        },
        shortest: {
            name: 'shortestPathRouteName',
            description: 'directPathDesc',
            color: '#8b5cf6',
            path: [
                [23.182, 75.768],
                [23.183, 75.768],
                [23.183, 75.765],
                [23.1848, 75.7652]
            ]
        }
    }
};


export const CROWD_ZONES = [
  { center: [23.181, 75.767] as [number, number], radius: 50, color: 'green', label: 'Low' },
  { center: [23.184, 75.766] as [number, number], radius: 70, color: 'orange', label: 'Medium' },
  { center: [23.1825, 75.7655] as [number, number], radius: 60, color: 'red', label: 'High' },
  { center: [23.1805, 75.766] as [number, number], radius: 40, color: 'purple', label: 'Critical' },
];

export const TRANSPORT_OPTIONS = [
  { name: 'AC Bus - Route A', price: '150', from: 'Indore-Ujjain', rating: 4.5, time: '1h 30m', departure: '06:00 AM', arrival: '07:30 AM', features: ['AC', 'Wi-Fi', 'Charging Port', 'Water Bottle'], image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop' },
  { name: 'Tempo Traveller - Shared', price: '200', from: 'Indore-Ujjain', rating: 4.6, time: '1h 45m', departure: '07:15 AM', arrival: '09:00 AM', features: ['AC', 'Charging Port'], image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1974&auto=format&fit=crop' },
  { name: 'Premium AC Bus - Express', price: '250', from: 'Indore-Ujjain', rating: 4.8, time: '1h 15m', departure: '08:00 AM', arrival: '09:15 AM', features: ['AC', 'Wi-Fi', 'Charging Port'], image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop' },
  { name: 'Non-AC Bus - Economy', price: '100', from: 'Indore-Ujjain', rating: 4.2, time: '1h 40m', departure: '08:30 AM', arrival: '10:10 AM', features: ['Non-AC', 'Basic Seating'], image: 'https://images.unsplash.com/photo-1555875219-c45f47026a69?q=80&w=1932&auto=format&fit=crop' },
];

export const STAY_OPTIONS = [
  { name: 'Premium Suite - Deluxe', location: 'Near Mahakaleshwar Temple', price: '1500', rating: 4.8, reviews: 1128, checkIn: '02:00 PM', checkOut: '11:00 AM', features: ['Luxury AC', 'Balcony', 'Mini Fridge', 'Room Service', 'Temple View'], image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Dormitory Bed - Shared', location: '5 min from temple', price: '250', rating: 4.6, reviews: 865, checkIn: '02:00 PM', checkOut: '10:00 AM', features: ['Shared Hall', 'Bunk Beds', 'Lockers'], image: 'https://images.unsplash.com/photo-1585412723936-ef54a15383a8?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Private Room - AC', location: 'City Center, Ujjain', price: '450', rating: 4.5, reviews: 632, checkIn: '02:00 PM', checkOut: '08:00 AM', features: ['AC', 'Attached Bath', 'Room Service'], image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Ganga View Hotel', location: 'Near Ram Ghat, Ujjain', price: '950', rating: 4.7, reviews: 940, checkIn: '12:00 PM', checkOut: '11:00 AM', features: ['AC', 'River View', 'Wi-Fi', 'Room Service'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop' },
];

export const HOME_FEATURES = {
    dailyNeeds: [
        { icon: Car, label: 'Ride', color: 'blue' },
        { icon: Bed, label: 'Stay', color: 'green' },
        { icon: Utensils, label: 'Food', color: 'yellow' },
        { icon: GlassWater, label: 'Water', color: 'cyan' },
    ],
    spiritualSafety: [
        { icon: Building2, label: 'Holy Site', color: 'orange' },
        { icon: Stethoscope, label: 'Doctor', color: 'pink' },
        { icon: FileWarning, label: 'Report', color: 'purple' },
    ]
}

export const REPORT_ROLES = [
    { name: 'Visitor', desc: 'General visitor', icon: User },
    { name: 'Security', desc: 'Security personnel', icon: ShieldCheck },
    { name: 'Volunteer', desc: 'Event volunteer', icon: Hand },
    { name: 'Medical', desc: 'Medical staff', icon: HeartHandshake },
    { name: 'Vendor', desc: 'Vendor/Staff', icon: Truck },
];
export const REPORT_ISSUES = ['Restroom', 'Waste', 'Medical', 'Crowd', 'System', 'Water', 'Other'];
export const REPORT_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const PRIORITY_COLORS: { [key: string]: string } = {
    'Low': 'bg-green-100 text-green-800 border-green-500',
    'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-500',
    'High': 'bg-orange-100 text-orange-800 border-orange-500',
    'Critical': 'bg-red-100 text-red-800 border-red-500'
};