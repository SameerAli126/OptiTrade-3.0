"use client"

import { useState } from "react"
import { Bell, ChevronDown, User, BarChart3, Settings, LogOut, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function UserProfileDropdown() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

    // Default user data in case auth context doesn't have it
    const userData = user || {
        id: "1",
        u_name: "Guest User",
        email: "guest@example.com",
    };

    // Extended user data with additional properties
    const extendedUserData = {
        ...userData,
        role: "Trader",
        avatar: "/profile-avatar.png",
        followers: 123,
        following: 45,
    };

    const notifications = [
        {
            id: 1,
            type: "trade",
            title: "Trade Executed",
            message: "BUY order for 50 AAPL shares completed",
            time: "2 min ago",
            icon: TrendingUp,
            color: "text-green-600",
        },
        {
            id: 2,
            type: "alert",
            title: "Price Alert",
            message: "TSLA reached your target price of $180",
            time: "5 min ago",
            icon: Bell,
            color: "text-blue-600",
        },
        {
            id: 3,
            type: "trade",
            title: "Trade Executed",
            message: "SELL order for 30 AAPL shares completed",
            time: "15 min ago",
            icon: TrendingDown,
            color: "text-red-600",
        },
        {
            id: 4,
            type: "system",
            title: "Market Update",
            message: "Market volatility detected in tech sector",
            time: "1 hour ago",
            icon: BarChart3,
            color: "text-orange-600",
        },
    ]

    const recentTransactions = [
        { type: "BUY", symbol: "AAPL", qty: 44, price: "$175.20", time: "12:36 AM", profit: "+$245.60" },
        { type: "SELL", symbol: "AAPL", qty: 10, price: "$174.80", time: "12:36 AM", profit: "-$12.40" },
        { type: "SELL", symbol: "AAPL", qty: 30, price: "$175.10", time: "12:37 AM", profit: "+$89.30" },
    ]

    const handleLogout = () => {
        logout();
        router.push('/login');
        setIsProfileOpen(false);
    };

    return (
        <div className="flex items-center justify-end gap-4">
            {/* Notifications Dropdown */}
            <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative p-2">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">{notifications.length}</span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-0" align="end">
                    <div className="p-4 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <p className="text-sm text-gray-600">{notifications.length} new notifications</p>
                    </div>
                    <ScrollArea className="h-80">
                        <div className="p-2">
                            {notifications.map((notification) => {
                                const IconComponent = notification.icon
                                return (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50"
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 ${notification.color}`}
                                        >
                                            <IconComponent className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <div className="font-medium text-sm text-gray-900 truncate">{notification.title}</div>
                                            <div className="text-sm text-gray-600 break-words leading-tight">{notification.message}</div>
                                            <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                                        </div>
                                    </DropdownMenuItem>
                                )
                            })}
                        </div>
                    </ScrollArea>
                    <div className="p-3 border-t">
                        <Button variant="ghost" className="w-full text-sm">
                            View All Notifications
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 p-1">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={extendedUserData.avatar || "/placeholder.svg"} alt={extendedUserData.u_name} />
                            <AvatarFallback>{extendedUserData.u_name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-600">Hi, {extendedUserData.u_name}</span>
                        <ChevronDown className="w-4 h-4 text-gray-600" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96 p-0" align="end">
                    {/* Profile Header */}
                    <div className="p-6 border-b">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16">
                                <AvatarImage src={extendedUserData.avatar || "/placeholder.svg"} alt={extendedUserData.u_name} />
                                <AvatarFallback className="text-lg">{extendedUserData.u_name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900">{extendedUserData.u_name}</h3>
                                <p className="text-gray-600 text-sm">{extendedUserData.role}</p>
                                <p className="text-gray-600 text-sm">{extendedUserData.email}</p>
                                <p className="text-gray-500 text-xs">UID: {extendedUserData.id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        <DropdownMenuItem
                            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                                setIsProfileModalOpen(true)
                                setIsProfileOpen(false)
                            }}
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Profile</div>
                                <div className="text-sm text-gray-600">Manage your account settings</div>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                                setIsTransactionModalOpen(true)
                                setIsProfileOpen(false)
                            }}
                        >
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Transaction History</div>
                                <div className="text-sm text-gray-600">View your trading activity</div>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                                setIsSettingsModalOpen(true)
                                setIsProfileOpen(false)
                            }}
                        >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Settings</div>
                                <div className="text-sm text-gray-600">Preferences and configurations</div>
                            </div>
                        </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Logout */}
                    <div className="p-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 p-4 text-white bg-cyan-500 hover:bg-cyan-600"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </Button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Transaction History Modal */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold">Transaction History</h2>
                            <Button
                                onClick={() => setIsTransactionModalOpen(false)}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white"
                            >
                                Close
                            </Button>
                        </div>
                        <div className="overflow-auto max-h-[60vh]">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="text-left p-3 font-medium text-gray-700">Type</th>
                                    <th className="text-left p-3 font-medium text-gray-700">Symbol</th>
                                    <th className="text-left p-3 font-medium text-gray-700">Details</th>
                                    <th className="text-left p-3 font-medium text-gray-700">Qty</th>
                                    <th className="text-left p-3 font-medium text-gray-700">Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {recentTransactions.map((transaction, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <Badge className={transaction.type === "BUY" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                {transaction.type}
                                            </Badge>
                                        </td>
                                        <td className="p-3 font-medium">{transaction.symbol}</td>
                                        <td className="p-3 text-gray-600">market</td>
                                        <td className="p-3">{transaction.qty}</td>
                                        <td className="p-3 text-gray-600">{transaction.time}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold">Profile</h2>
                            <Button onClick={() => setIsProfileModalOpen(false)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                                Close
                            </Button>
                        </div>
                        <div className="p-6">
                            {/* Profile Header Section */}
                            <div className="flex items-start gap-6 mb-8">
                                <div className="relative">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={extendedUserData.avatar || "/placeholder.svg"} alt={extendedUserData.u_name} />
                                        <AvatarFallback className="text-2xl bg-orange-400 text-white">
                                            {extendedUserData.u_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-900">{extendedUserData.u_name}</h1>
                                    </div>

                                    {/* User Stats Grid */}
                                    <div className="grid grid-cols-5 gap-6 mt-4">
                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 mb-1">User ID</div>
                                            <div className="font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                                                #{extendedUserData.id}
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 mb-1">VIP Level</div>
                                            <div className="font-semibold text-gray-900">
                                                Regular User
                                                <div className="text-xs text-gray-500">Level 1</div>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 mb-1">User Type</div>
                                            <div className="font-semibold text-gray-900">Personal</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 mb-1">Following</div>
                                            <div className="font-semibold text-gray-900">{extendedUserData.following}</div>
                                        </div>

                                        <div className="text-center">
                                            <div className="text-sm text-gray-500 mb-1">Followers</div>
                                            <div className="font-semibold text-gray-900">{extendedUserData.followers}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Profile Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-3">Account Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="text-gray-900">{extendedUserData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Role:</span>
                                            <span className="text-gray-900">{extendedUserData.role}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Member Since:</span>
                                            <span className="text-gray-900">Jan 2024</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Last Login:</span>
                                            <span className="text-gray-900">2 hours ago</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-900 mb-3">Trading Stats</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Trades:</span>
                                            <span className="text-gray-900">127</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Win Rate:</span>
                                            <span className="text-green-600">68.5%</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total P&L:</span>
                                            <span className="text-green-600">+$2,450.80</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Best Trade:</span>
                                            <span className="text-green-600">+$340.20</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {isSettingsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h2 className="text-xl font-semibold">Settings</h2>
                            <Button
                                onClick={() => setIsSettingsModalOpen(false)}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white"
                            >
                                Close
                            </Button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Settings content */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium">Profile Information</h4>
                                            <p className="text-sm text-gray-600">Update your profile details</p>
                                        </div>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium">Password & Security</h4>
                                            <p className="text-sm text-gray-600">Manage your password and security settings</p>
                                        </div>
                                        <Button variant="outline" size="sm">Manage</Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium">Theme</h4>
                                            <p className="text-sm text-gray-600">Choose light or dark theme</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" className="p-1">Light</Button>
                                            <Button variant="ghost" size="sm" className="p-1">Dark</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h4 className="font-medium">Notifications</h4>
                                            <p className="text-sm text-gray-600">Manage your notification preferences</p>
                                        </div>
                                        <Button variant="outline" size="sm">Configure</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}