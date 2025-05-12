import { Box, Typography, Container, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import CookieIcon from '@mui/icons-material/Cookie';

const CookiePolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <CookieIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" component="h1">
            Politica dei Cookie
          </Typography>
        </Box>

        <Typography paragraph>
          Questa politica sui cookie spiega cosa sono i cookie e come li utilizziamo su WILLY.AI. 
          Ti consigliamo di leggere questa politica per comprendere che tipo di cookie utilizziamo, 
          le informazioni che raccogliamo e come queste informazioni vengono utilizzate.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Cosa sono i Cookie?
        </Typography>
        <Typography paragraph>
          I cookie sono piccoli file di testo che vengono memorizzati sul tuo computer o dispositivo mobile 
          quando visiti un sito web. Sono ampiamente utilizzati per far funzionare i siti web o per farli 
          funzionare in modo più efficiente, nonché per fornire informazioni ai proprietari del sito.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Come Utilizziamo i Cookie
        </Typography>
        <Typography paragraph>
          Utilizziamo diversi tipi di cookie per vari scopi. I cookie possono essere classificati come segue:
        </Typography>

        <List>
          <ListItem>
            <ListItemText
              primary="Cookie Necessari"
              secondary="Questi cookie sono essenziali per il corretto funzionamento del nostro sito web. 
                        Senza questi cookie, il sito web non funzionerebbe correttamente. Questi cookie non 
                        raccolgono informazioni che potrebbero essere utilizzate per scopi di marketing."
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Cookie Funzionali"
              secondary="Questi cookie ci permettono di ricordare le tue preferenze e di personalizzare il 
                        nostro sito web di conseguenza. Ad esempio, possiamo memorizzare la tua posizione 
                        geografica in un cookie per assicurarci di mostrarti il nostro sito web localizzato 
                        per la tua area."
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Cookie Analitici"
              secondary="Utilizziamo questi cookie per raccogliere informazioni su come utilizzi il nostro 
                        sito web. Questi cookie ci aiutano a migliorare il nostro sito web monitorando quali 
                        pagine trovi più utili e dove potrebbero verificarsi degli errori."
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Cookie di Marketing"
              secondary="Questi cookie vengono utilizzati per mostrarti pubblicità più pertinenti ai tuoi 
                        interessi. Vengono anche utilizzati per limitare il numero di volte che vedi una 
                        pubblicità e per aiutare a misurare l'efficacia delle campagne pubblicitarie."
            />
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Gestione dei Cookie
        </Typography>
        <Typography paragraph>
          Puoi gestire le tue preferenze sui cookie in qualsiasi momento attraverso il pannello delle 
          impostazioni dei cookie accessibile dal pulsante fluttuante nell'angolo in basso a destra 
          del sito. Inoltre, la maggior parte dei browser web ti permette di controllare i cookie 
          attraverso le loro impostazioni. Scopri di più su come gestire i cookie nel tuo browser:
        </Typography>

        <List>
          <ListItem>
            <ListItemText
              primary="Google Chrome"
              secondary="Vai al menu → Impostazioni → Mostra impostazioni avanzate → Privacy → Impostazioni contenuti"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Mozilla Firefox"
              secondary="Vai al menu → Opzioni → Privacy → Cronologia → Impostazioni personalizzate"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Safari"
              secondary="Vai a Preferenze → Privacy → Cookie e dati di siti web"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Microsoft Edge"
              secondary="Vai al menu → Impostazioni → Cookie e autorizzazioni sito"
            />
          </ListItem>
        </List>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Aggiornamenti alla Politica dei Cookie
        </Typography>
        <Typography paragraph>
          Possiamo aggiornare questa politica dei cookie periodicamente. Ti consigliamo di visitare 
          questa pagina regolarmente per essere sempre informato su come utilizziamo i cookie. 
          Questa politica è stata aggiornata l'ultima volta il 1 Febbraio 2024.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Contattaci
        </Typography>
        <Typography paragraph>
          Se hai domande sulla nostra politica dei cookie o sul modo in cui utilizziamo i cookie, 
          non esitare a contattarci all'indirizzo privacy@willy.ai
        </Typography>
      </Paper>
    </Container>
  );
};

export default CookiePolicy;