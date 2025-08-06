import React, { useState, useRef } from "react";
import { uploadDocument, querySystem } from "./api";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Slide,
} from "@mui/material";
import { motion } from "framer-motion";
function formatJustification(justification) {
  // Split justification into bullet points by numbers or dashes
  const points = justification
    .split(/(?:\d\)| and |\n|\. )/g)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  return points;
}
function App() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const resultRef = useRef(null);

  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      await uploadDocument(file);
      setUploaded(true);
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    setLoading(true);
    const res = await querySystem(query);
    let result = res.response;
    // If result is a string, try to parse it as JSON
    if (typeof result === "string") {
      try {
        result = JSON.parse(result);
      } catch {
        // If parsing fails, keep as string
      }
    }
    setResponse(result);
    setLoading(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Typography variant="h3" align="center" gutterBottom fontWeight={700}>
          LLM Document Processing System
        </Typography>
        <Paper elevation={4} sx={{ p: 4, mb: 4 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="h6">Upload Document</Typography>
            <input
              type="file"
              onChange={e => setFile(e.target.files[0])}
              style={{ marginBottom: 8 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={!file || loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
            {uploaded && (
              <Slide direction="up" in={uploaded} mountOnEnter unmountOnExit>
                <Typography color="success.main" fontWeight={600}>
                  Document uploaded successfully!
                </Typography>
              </Slide>
            )}
            <Typography variant="h6" sx={{ mt: 3 }}>
              Enter Query
            </Typography>
            <TextField
              label="Your Query"
              variant="outlined"
              value={query}
              onChange={e => setQuery(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleQuery}
              disabled={!query || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit Query"}
            </Button>
          </Box>
        </Paper>
        {response && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={6} sx={{ p: 3, background: "#e3f2fd", textAlign: "center" }}>
              <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>
                Result
              </Typography>
              {typeof response === "object" && response.decision ? (
                <Typography
                  variant="h5"
                  fontWeight={900}
                  color={response.decision === "approved" ? "success.main" : "error.main"}
                  sx={{ mt: 2 }}
                >
                  {response.decision === "approved"
                    ? `✅ ${response.justification}`
                    : `❌ ${response.justification}`}
                </Typography>
              ) : (
                <Typography variant="h6" fontWeight={700}>
                  {String(response)}
                </Typography>
              )}
            </Paper>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
}

export default App;