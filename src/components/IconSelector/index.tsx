import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import { iconLibrary, iconCategories } from '@/data/iconLibrary';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LockIcon from '@mui/icons-material/Lock';

interface IconSelectorProps {
  subscription: 'free' | 'basic' | 'pro' | 'enterprise';
  onSelect: (icon: string) => void;
}

const IconSelector = ({ subscription, onSelect }: IconSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtra le icone in base alla categoria e alla ricerca
  const filteredIcons = iconLibrary.filter(icon => {
    const matchesCategory = activeCategory === 'all' || icon.category === activeCategory;
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Verifica se un'icona è disponibile per il piano di abbonamento corrente
  const isIconAvailable = (iconSubscription: string): boolean => {
    const subscriptionLevels = ['free', 'basic', 'pro', 'enterprise'];
    const currentLevel = subscriptionLevels.indexOf(subscription);
    const requiredLevel = subscriptionLevels.indexOf(iconSubscription);
    return currentLevel >= requiredLevel;
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Barra di ricerca */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Cerca icone ed emoji..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
      </Box>

      {/* Tabs delle categorie */}
      <Tabs
        value={activeCategory}
        onChange={(e, newValue) => setActiveCategory(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        <Tab label="Tutte" value="all" />
        {iconCategories.map((category) => (
          <Tab
            key={category}
            label={category.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
            value={category}
          />
        ))}
      </Tabs>

      {/* Griglia delle icone */}
      <Grid container spacing={2}>
        {filteredIcons.map((icon) => {
          const isAvailable = isIconAvailable(icon.subscription);

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={icon.id}>
              <Tooltip
                title={!isAvailable ? `Disponibile nel piano ${icon.subscription}` : icon.name}
                arrow
              >
                <Card
                  sx={{
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    opacity: isAvailable ? 1 : 0.6,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': isAvailable ? {
                      transform: 'translateY(-4px)',
                      boxShadow: 3
                    } : {}
                  }}
                  onClick={() => isAvailable && onSelect(icon.value)}
                >
                  <CardContent sx={{ 
                    textAlign: 'center',
                    position: 'relative',
                    p: 2
                  }}>
                    {!isAvailable && (
                      <LockIcon
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          fontSize: 16,
                          color: 'text.secondary'
                        }}
                      />
                    )}
                    <Typography variant="h4" component="div" gutterBottom>
                      {icon.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {icon.name}
                    </Typography>
                    <Chip
                      label={icon.category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default IconSelector;