import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  date: string;
  views: number;
  engagement: number;
  shares: number;
  clicks: number;
}

interface MetricCard {
  title: string;
  value: number;
  change: number;
  format: string;
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Implementare la logica di fetch dei dati
      const mockData: AnalyticsData[] = [
        { date: '2024-02-01', views: 1200, engagement: 450, shares: 120, clicks: 300 },
        { date: '2024-02-02', views: 1400, engagement: 520, shares: 150, clicks: 350 },
        { date: '2024-02-03', views: 1100, engagement: 480, shares: 130, clicks: 280 },
        { date: '2024-02-04', views: 1600, engagement: 600, shares: 180, clicks: 400 },
        { date: '2024-02-05', views: 1800, engagement: 650, shares: 200, clicks: 450 },
      ];
      setData(mockData);
    } catch (error) {
      console.error('Errore nel caricamento dei dati analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics: MetricCard[] = [
    {
      title: 'Visualizzazioni Totali',
      value: data.reduce((sum, item) => sum + item.views, 0),
      change: 12.5,
      format: 'number'
    },
    {
      title: 'Tasso di Engagement',
      value: data.reduce((sum, item) => sum + item.engagement, 0) / data.length,
      change: 8.3,
      format: 'percentage'
    },
    {
      title: 'Condivisioni',
      value: data.reduce((sum, item) => sum + item.shares, 0),
      change: -2.1,
      format: 'number'
    },
    {
      title: 'Click',
      value: data.reduce((sum, item) => sum + item.clicks, 0),
      change: 15.7,
      format: 'number'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Analytics</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Periodo</InputLabel>
          <Select
            value={timeRange}
            label="Periodo"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="7d">Ultimi 7 giorni</MenuItem>
            <MenuItem value="30d">Ultimi 30 giorni</MenuItem>
            <MenuItem value="90d">Ultimi 90 giorni</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {metric.title}
                </Typography>
                <Typography variant="h4" component="div">
                  {metric.format === 'percentage'
                    ? `${metric.value.toFixed(1)}%`
                    : metric.value.toLocaleString()}
                </Typography>
                <Typography
                  color={metric.change >= 0 ? 'success.main' : 'error.main'}
                  variant="body2"
                >
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Andamento nel Tempo
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#8884d8"
              name="Visualizzazioni"
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#82ca9d"
              name="Engagement"
            />
            <Line
              type="monotone"
              dataKey="shares"
              stroke="#ffc658"
              name="Condivisioni"
            />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default Analytics;