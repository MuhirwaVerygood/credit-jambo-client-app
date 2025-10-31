"use client"

import { useState, createContext, useContext } from "react"
import { usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

const SearchContext = createContext<{
  searchQuery: string
  setSearchQuery: (query: string) => void
}>({ searchQuery: '', setSearchQuery: () => {} })

const SidebarContext = createContext<{
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}>({ isCollapsed: false, setIsCollapsed: () => {} })

export const useSearch = () => useContext(SearchContext)
export const useSidebar = () => useContext(SidebarContext)

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex overflow-hidden">
      {/* Sidebar */}
      <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
        <DashboardSidebar className="hidden lg:flex fixed left-0 top-0 h-full" />
      </SidebarContext.Provider>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white">
            <DashboardSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Header */}
        <div className="sticky top-0 z-30">
          <DashboardHeader 
          onMenuClick={toggleSidebar} 
          showSearch={pathname !== '/dashboard/transactions'} 
          onSearch={setSearchQuery}
        />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 lg:py-8">
            <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
              <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
                {children}
              </SearchContext.Provider>
            </SidebarContext.Provider>
          </div>
        </main>
      </div>
    </div>
  )
}