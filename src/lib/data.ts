// Project data interface and utilities
export interface ProjectData {
  projectId: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  websiteName: string;
  projectPrice: number;
  negotiated: boolean;
  deliveredOnTime: boolean;
  deliveryDate: string;
  deliveryStatus: 'On Time' | 'Delayed' | 'In Progress';
  techStack: string;
  developersNeeded: number;
  assignedDevelopers: string;
  developmentTeamName: string;
}

// Raw CSV data from Google Sheets
const rawData = `Project ID,Customer Name,Customer Address,Customer Phone,Website Name,Project Price (INR),Negotiated,Delivered On Time,Delivery Date,Delivery Status,Tech Stack,Developers Needed,Assigned Developer(s),Development Team Name
1,Meera Meera,Mumbai,9377664970,meerameera.tech.in,"₹172,964",Yes,Yes,21-Apr-2025,On Time,VueJS,3,"Meera, Rohan, Rohan",Team Sigma
2,Kabir Dev,Hyderabad,9911068904,kabirdev.cloud.in,"₹1,171,387",No,No,14-Mar-2025,Delayed,NextJS,3,"Kabir, Aarav, Rohan",Team Hydra
3,Meera Ishita,Kolkata,9595007137,meeraishita.solutions.in,"₹148,186",No,No,01-Aug-2025,In Progress,Laravel,2,"Rohan, Ishita",Team Orion
4,Meera Meera,Hyderabad,9467628828,meerameera.solutions.in,"₹51,430",No,Yes,05-Jun-2025,On Time,VueJS,2,"Saanvi, Rohan",Team Orion
5,Diya Anaya,Pune,9877512562,diyaanaya.services.in,"₹100,121",No,Yes,22-Feb-2025,On Time,VueJS,4,"Meera, Diya, Meera, Saanvi",Team Nova
6,Diya Saanvi,Chennai,9800051301,diyasaanvi.services.in,"₹78,114",Yes,Yes,05-Aug-2025,In Progress,MERN,4,"Diya, Anaya, Saanvi, Meera",Team Nova
7,Kabir Rohan,Delhi,9813473220,kabirrohan.services.in,"₹38,144",Yes,Yes,14-Apr-2025,On Time,Python-Django,4,"Kabir, Kabir, Aarav, Rohan",Team Orion
8,Ayaan Kabir,Delhi,9826522448,ayaankabir.cloud.in,"₹59,104",No,Yes,03-Mar-2025,On Time,Python-Django,4,"Kabir, Ayaan, Anaya, Dev",Team Blaze
9,Diya Ishita,Delhi,9802894569,diyaishita.services.in,"₹32,495",Yes,No,02-Aug-2025,In Progress,Laravel,3,"Dev, Ayaan, Diya",Team Orion
10,Ayaan Rohan,Hyderabad,9747926360,ayaanrohan.tech.in,"₹98,890",No,Yes,09-Apr-2025,On Time,ReactJS,3,"Diya, Ayaan, Anaya",Team Orion
11,Ayaan Rohan,Kolkata,9808791954,ayaanrohan.digital.in,"₹119,873",No,Yes,13-Jun-2025,On Time,ReactJS,3,"Ishita, Aarav, Dev",Team Falcon
12,Ayaan Diya,Pune,9292061211,ayaandiya.solutions.in,"₹109,328",No,Yes,26-Aug-2025,In Progress,ReactJS,4,"Aarav, Saanvi, Dev, Dev",Team Hydra
13,Saanvi Aarav,Chennai,9568762558,saanviaarav.digital.in,"₹66,137",Yes,Yes,15-Aug-2025,In Progress,NextJS,3,"Anaya, Ishita, Kabir",Team Nova
14,Rohan Ayaan,Delhi,9291166473,rohanayaan.cloud.in,"₹61,738",No,Yes,18-Jul-2025,In Progress,NextJS,2,"Rohan, Ayaan",Team Falcon
15,Diya Rohan,Mumbai,9434536912,diyarohan.solutions.in,"₹129,445",No,Yes,30-Mar-2025,On Time,Python-Django,2,"Anaya, Diya",Team Sigma
16,Meera Saanvi,Hyderabad,9858568473,meerasaanvi.services.in,"₹159,772",Yes,Yes,09-Jul-2025,In Progress,Python-Django,4,"Rohan, Kabir, Ishita, Saanvi",Team Orion
17,Dev Ishita,Kolkata,9965499071,devishita.tech.in,"₹69,892",No,Yes,16-Jun-2025,On Time,VueJS,2,"Saanvi, Anaya",Team Falcon
18,Aarav Saanvi,Pune,9924159765,aaravsaanvi.tech.in,"₹130,663",No,No,07-May-2025,Delayed,ReactJS,4,"Meera, Saanvi, Anaya, Ayaan",Team Blaze
19,Kabir Ishita,Chennai,9567014398,kabirishita.services.in,"₹78,359",Yes,Yes,24-Apr-2025,On Time,MERN,3,"Rohan, Diya, Meera",Team Blaze
20,Ishita Anaya,Delhi,9612421962,ishitaanaya.tech.in,"₹161,950",No,No,11-Aug-2025,In Progress,Laravel,4,"Ishita, Saanvi, Anaya, Diya",Team Hydra`;

function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[₹,]/g, ''));
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-');
  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  return new Date(parseInt(year), monthMap[month], parseInt(day));
}

export function parseProjectData(): ProjectData[] {
  const lines = rawData.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    
    return {
      projectId: parseInt(values[0]),
      customerName: values[1],
      customerAddress: values[2],
      customerPhone: values[3],
      websiteName: values[4],
      projectPrice: parsePrice(values[5]),
      negotiated: values[6] === 'Yes',
      deliveredOnTime: values[7] === 'Yes',
      deliveryDate: values[8],
      deliveryStatus: values[9] as 'On Time' | 'Delayed' | 'In Progress',
      techStack: values[10],
      developersNeeded: parseInt(values[11]),
      assignedDevelopers: values[12].replace(/"/g, ''),
      developmentTeamName: values[13]
    };
  });
}

export function calculateKPIs(data: ProjectData[]) {
  const totalProjects = data.length;
  const completedProjects = data.filter(p => p.deliveryStatus !== 'In Progress').length;
  const onTimeProjects = data.filter(p => p.deliveredOnTime).length;
  const totalPrice = data.reduce((sum, p) => sum + p.projectPrice, 0);
  const uniqueTeams = new Set(data.map(p => p.developmentTeamName)).size;
  const onTimeRate = (onTimeProjects / totalProjects) * 100;

  return {
    totalProjects,
    completedProjects,
    totalPrice,
    uniqueTeams,
    onTimeRate
  };
}

export function getProjectsByTeam(data: ProjectData[]) {
  const teamCounts: { [key: string]: number } = {};
  data.forEach(project => {
    teamCounts[project.developmentTeamName] = (teamCounts[project.developmentTeamName] || 0) + 1;
  });
  return Object.entries(teamCounts).map(([name, count]) => ({ name, count }));
}

export function getDeliveryStatusDistribution(data: ProjectData[]) {
  const statusCounts: { [key: string]: number } = {};
  data.forEach(project => {
    statusCounts[project.deliveryStatus] = (statusCounts[project.deliveryStatus] || 0) + 1;
  });
  return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
}

export function getTechStackDistribution(data: ProjectData[]) {
  const techCounts: { [key: string]: number } = {};
  data.forEach(project => {
    techCounts[project.techStack] = (techCounts[project.techStack] || 0) + 1;
  });
  return Object.entries(techCounts).map(([tech, count]) => ({ tech, count }));
}

export function getMonthlyTrends(data: ProjectData[]) {
  const monthlyData: { [key: string]: { deliveries: number; totalValue: number; projects: number } } = {};
  
  data.forEach(project => {
    if (project.deliveryStatus !== 'In Progress') {
      const date = parseDate(project.deliveryDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { deliveries: 0, totalValue: 0, projects: 0 };
      }
      
      monthlyData[monthKey].deliveries += 1;
      monthlyData[monthKey].totalValue += project.projectPrice;
      monthlyData[monthKey].projects += 1;
    }
  });

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      deliveries: data.deliveries,
      averageValue: Math.round(data.totalValue / data.projects),
      totalValue: data.totalValue
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}