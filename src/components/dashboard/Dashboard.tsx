import { useState, useMemo } from "react";
import { ProjectData, parseProjectData, calculateKPIs, getProjectsByTeam, getDeliveryStatusDistribution, getTechStackDistribution, getMonthlyTrends } from "@/lib/data";
import { KPICard } from "./KPICard";
import { ProjectsChart } from "./ProjectsChart";
import { FilterPanel } from "./FilterPanel";
import { ProjectTable } from "./ProjectTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Dashboard() {
  const allData = parseProjectData();
  const [filteredData, setFilteredData] = useState<ProjectData[]>(allData);

  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);
  const teamData = useMemo(() => getProjectsByTeam(filteredData), [filteredData]);
  const statusData = useMemo(() => getDeliveryStatusDistribution(filteredData), [filteredData]);
  const techData = useMemo(() => getTechStackDistribution(filteredData), [filteredData]);
  const trendsData = useMemo(() => getMonthlyTrends(filteredData), [filteredData]);

  const priceDistribution = useMemo(() => {
    const ranges = [
      { range: '₹0-50K', min: 0, max: 50000 },
      { range: '₹50K-100K', min: 50000, max: 100000 },
      { range: '₹100K-200K', min: 100000, max: 200000 },
      { range: '₹200K+', min: 200000, max: Infinity }
    ];

    return ranges.map(({ range, min, max }) => ({
      range,
      count: filteredData.filter(p => p.projectPrice >= min && p.projectPrice < max).length
    }));
  }, [filteredData]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                📊 Project Management Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive overview of development projects and team performance
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Projects</div>
              <div className="text-2xl font-bold text-primary">{filteredData.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Project Value"
                value={`₹${kpis.totalPrice.toLocaleString()}`}
                subtitle="Combined value of all projects"
                icon="💰"
              />
              <KPICard
                title="On-Time Delivery Rate"
                value={`${kpis.onTimeRate.toFixed(1)}%`}
                subtitle="Projects delivered on schedule"
                icon="⏱️"
                trend={{ value: 5.2, isPositive: true }}
              />
              <KPICard
                title="Development Teams"
                value={kpis.uniqueTeams}
                subtitle="Active development teams"
                icon="👥"
              />
              <KPICard
                title="Completed Projects"
                value={`${kpis.completedProjects}/${kpis.totalProjects}`}
                subtitle="Finished vs total projects"
                icon="✅"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectsChart
                data={teamData}
                title="📈 Projects by Development Team"
                type="bar"
              />
              <ProjectsChart
                data={statusData.map(item => ({ name: item.status, count: item.count }))}
                title="📊 Delivery Status Distribution"
                type="pie"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectsChart
                data={techData.map(item => ({ name: item.tech, count: item.count }))}
                title="🛠️ Technology Stack Usage"
                type="bar"
              />
              <ProjectsChart
                data={priceDistribution.map(item => ({ name: item.range, count: item.count }))}
                title="💵 Project Price Distribution"
                type="bar"
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <FilterPanel data={allData} onFilterChange={setFilteredData} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProjectsChart
                data={teamData}
                title="Team Performance Analysis"
                type="bar"
              />
              <ProjectsChart
                data={statusData.map(item => ({ name: item.status, count: item.count }))}
                title="Project Status Breakdown"
                type="pie"
              />
            </div>

            <ProjectsChart
              data={techData.map(item => ({ name: item.tech, count: item.count }))}
              title="Technology Stack Adoption"
              type="bar"
            />
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ProjectsChart
                data={trendsData}
                title="📈 Project Delivery Timeline"
                type="line"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProjectsChart
                  data={trendsData.map(item => ({ name: item.month, count: item.totalValue }))}
                  title="Monthly Revenue Trends"
                  type="bar"
                />
                <ProjectsChart
                  data={trendsData.map(item => ({ name: item.month, count: item.deliveries }))}
                  title="Monthly Delivery Volume"
                  type="bar"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <FilterPanel data={allData} onFilterChange={setFilteredData} />
            <ProjectTable data={filteredData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}