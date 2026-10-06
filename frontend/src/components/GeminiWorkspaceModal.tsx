import React, { useState, useEffect } from 'react';
import { summarizeFileApi, getFileInsightsApi, queryFileApi, getAIHistoryApi } from '../services/api';
import { FileItem } from '../types';
import { Sparkles, X, FileText, Lightbulb, MessageSquare, Loader2, Send, Bot } from 'lucide-react';

interface GeminiWorkspaceModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiWorkspaceModal: React.FC<GeminiWorkspaceModalProps> = ({ file, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'insights' | 'query'>('summary');
  
  // State for AI outputs
  const [summary, setSummary] = useState<string>('');
  const [insights, setInsights] = useState<string[]>([]);
  const [queryPrompt, setQueryPrompt] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ prompt: string; response: string; time: string }>>([]);

  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [loadingQuery, setLoadingQuery] = useState<boolean>(false);

  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && file) {
      // Fetch initial summary and insights on open
      handleFetchSummary();
      handleFetchInsights();
      handleFetchHistory();
    } else {
      setSummary('');
      setInsights([]);
      setChatHistory([]);
    }
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  const handleFetchHistory = async () => {
    try {
      const res = await getAIHistoryApi(file._id);
      const historyItems = res.data.filter((item: any) => item.type === 'query');
      setChatHistory(
        historyItems.map((h: any) => ({
          prompt: h.queryPrompt,
          response: h.response,
          time: new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }))
      );
    } catch (err) {
      console.error('[GeminiWorkspace] Failed to fetch history:', err);
    }
  };

  const handleFetchSummary = async () => {
    try {
      setLoadingSummary(true);
      setError('');
      const res = await summarizeFileApi(file._id);
      setSummary(res.data.summary);
    } catch (err: any) {
      console.error('[GeminiWorkspace] Summarize error:', err);
      setError(err.response?.data?.message || 'Error generating AI summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleFetchInsights = async () => {
    try {
      setLoadingInsights(true);
      const res = await getFileInsightsApi(file._id);
      setInsights(res.data.insights);
    } catch (err: any) {
      console.error('[GeminiWorkspace] Insights error:', err);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryPrompt.trim()) return;

    const currentPrompt = queryPrompt.trim();
    setQueryPrompt('');

    try {
      setLoadingQuery(true);
      const res = await queryFileApi(file._id, currentPrompt);
      setChatHistory((prev) => [
        ...prev,
        {
          prompt: currentPrompt,
          response: res.data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      console.error('[GeminiWorkspace] Query error:', err);
      setError(err.response?.data?.message || 'Error querying file');
    } finally {
      setLoadingQuery(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-indigo-500/20 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Gemini AI Productivity Hub</span>
              </h3>
              <p className="text-xs text-slate-400">
                File: <span className="font-semibold text-indigo-300">{file.originalName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-800/80 my-4">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'summary'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Summary</span>
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'insights'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Content Insights</span>
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === 'query'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Contextual Q&A</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-[300px]">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {loadingSummary ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-sm font-medium">Generating intelligent summary with Gemini API...</p>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-indigo-400">
                    File Overview & Summary
                  </h4>
                  <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {summary || 'No summary available for this file.'}
                  </div>
                  <div className="pt-2 text-right">
                    <button
                      onClick={handleFetchSummary}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                    >
                      Regenerate Summary
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INSIGHTS */}
          {activeTab === 'insights' && (
            <div className="space-y-4">
              {loadingInsights ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-3">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                  <p className="text-sm font-medium">Extracting key insights and structural takeaways...</p>
                </div>
              ) : insights.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">No insights generated yet.</p>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-purple-400">
                    Key Insights & Action Items
                  </h4>
                  {insights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-200 leading-snug">{insight}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: QUERY / ASK AI */}
          {activeTab === 'query' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex-1 space-y-3 max-h-[320px] overflow-y-auto pr-1">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 space-y-2">
                    <Bot className="w-10 h-10 mx-auto text-indigo-400/60" />
                    <p className="text-xs">Ask any question related to "{file.originalName}"</p>
                  </div>
                ) : (
                  chatHistory.map((item, index) => (
                    <div key={index} className="space-y-2">
                      {/* User Prompt */}
                      <div className="flex justify-end">
                        <div className="max-w-[85%] bg-indigo-600/30 border border-indigo-500/30 text-indigo-100 text-xs px-3.5 py-2.5 rounded-2xl rounded-tr-none">
                          {item.prompt}
                        </div>
                      </div>
                      {/* AI Response */}
                      <div className="flex justify-start items-start space-x-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs flex-shrink-0 mt-1">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div className="max-w-[85%] bg-slate-900 border border-slate-800 text-slate-200 text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-none whitespace-pre-line leading-relaxed">
                          {item.response}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {loadingQuery && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Gemini is thinking...</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendQuery} className="flex space-x-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Ask a question about this file..."
                  value={queryPrompt}
                  onChange={(e) => setQueryPrompt(e.target.value)}
                  disabled={loadingQuery}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!queryPrompt.trim() || loadingQuery}
                  className="gradient-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
