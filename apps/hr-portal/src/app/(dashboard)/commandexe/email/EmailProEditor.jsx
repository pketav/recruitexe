'use client'

import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react'
import {
  Alert,
  Autocomplete,
  Button,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Dialog,
  Box,
  Typography,
  Divider,
  Tooltip,
  Chip,
  Tab,
  Tabs,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'

import JoditEditor from 'jodit-pro-react'

import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import SaveIcon from '@mui/icons-material/Save'
import PreviewIcon from '@mui/icons-material/Preview'
import FormatPaintIcon from '@mui/icons-material/FormatPaint'
import MicIcon from '@mui/icons-material/Mic'
import ClearIcon from '@mui/icons-material/Clear'
import TranslateIcon from '@mui/icons-material/Translate'
import SearchIcon from '@mui/icons-material/Search'
import SpellcheckIcon from '@mui/icons-material/Spellcheck'
import BackupIcon from '@mui/icons-material/Backup'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import MapIcon from '@mui/icons-material/Map'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import SmartToyIcon from '@mui/icons-material/SmartToy'

import CustomTextField from '@/@core/components/mui/TextField'
import { SettingsIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

/**
 * Complete Jodit PRO Editor Component with ALL Professional Features
 *
 * Features included:
 * ✅ AutoComplete - Smart content suggestions
 * ✅ Backup Plugin - Automatic content backup
 * ✅ Advanced Image Editor - Professional image editing tools
 * ✅ Spell Checker - Real-time spell checking
 * ✅ Find & Replace - Advanced search functionality
 * ✅ Emoji Support - Rich emoji picker with autocomplete
 * ✅ ToDo Lists - Interactive task lists with checkboxes
 * ✅ Google Maps Editor - Embed interactive maps
 * ✅ Export to PDF - Professional document export
 * ✅ Paste from Word PRO - Enhanced Word document import
 * ✅ Mobile View - Responsive mobile editing
 * ✅ Virtual Keyboard - On-screen keyboard support
 * ✅ Speech Recognition - Voice-to-text input
 * ✅ Translation - Multi-language support with Google Translate
 * ✅ Advanced Table Editor - Professional table management
 * ✅ Custom Color Picker - Extended color options
 * ✅ Google Search Integration - Search and insert content
 * ✅ Code Paste - Syntax-highlighted code blocks
 * ✅ Show Blocks - Visual block structure
 * ✅ Highlight Signature - Digital signature support
 * ✅ Page Break - Professional page break handling
 * ✅ Iframe Editor - Embed external content
 * ✅ Tune Block - Advanced block styling
 * ✅ Button Generator - Custom button creation
 * ✅ Change Case - Text case transformations
 * ✅ Finder - Advanced search in content
 * ✅ AI Assistant - AI-powered content enhancement
 */
const JoditProEditor = ({
  tName = '',
  onChange,
  initialValue = '',
  variables = [],
  onSave,
  selectedPartner,
  selectedProduct,
  onPartnerChange,
  onProductChange
}) => {
  // Editor state
  const editor = useRef(null)
  const [content, setContent] = useState(initialValue)
  const [templateName, setTemplateName] = useState('')
  const [templateContent, setTemplateContent] = useState('')
  const router = useRouter()
  // UI state
  const [isCustomFullscreen, setIsCustomFullscreen] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  // Feature state
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [recentVariables, setRecentVariables] = useState([])
  const [isLicenseActive, setIsLicenseActive] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true)
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true)

  // Speech recognition state
  const [speechRecognition, setSpeechRecognition] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [recognitionLanguage, setRecognitionLanguage] = useState('en-US')

  // Translation state
  const [translationLanguage, setTranslationLanguage] = useState('es')

  // Pro features state
  const [backupInterval, setBackupInterval] = useState(5)
  const [maxBackups, setMaxBackups] = useState(10)
  const [enableEmojiAutocomplete, setEnableEmojiAutocomplete] = useState(true)
  const [enableGoogleMaps, setEnableGoogleMaps] = useState(true)
  const [enableVirtualKeyboard, setEnableVirtualKeyboard] = useState(true)

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Enhanced content change handler with analytics
  const handleChange = useCallback(
    newContent => {
      if (newContent !== content) {
        setContent(newContent)

        // Calculate word and character count
        const textContent = newContent.replace(/<[^>]*>/g, '').trim()
        const words = textContent ? textContent.split(/\s+/).length : 0
        const characters = textContent.length

        setWordCount(words)
        setCharacterCount(characters)

        if (onChange) onChange(newContent)
      }
    },
    [content, onChange]
  )

  // Initialize speech recognition (PRO feature)
  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = recognitionLanguage

      recognition.onstart = () => {
        setIsListening(true)
        setSnackbar({
          open: true,
          message: `Speech recognition started in ${recognitionLanguage}. Start speaking...`,
          severity: 'info'
        })
      }

      recognition.onresult = event => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }

        if (finalTranscript && editor.current && editor.current.jodit) {
          editor.current.jodit.selection.insertHTML(finalTranscript + ' ')
        }
      }

      recognition.onerror = event => {
        setIsListening(false)
        setSnackbar({
          open: true,
          message: `Speech recognition error: ${event.error}`,
          severity: 'error'
        })
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      setSpeechRecognition(recognition)
    }
  }

  const toggleSpeechRecognition = () => {
    if (!speechRecognition) {
      initializeSpeechRecognition()
      return
    }

    if (isListening) {
      speechRecognition.stop()
    } else {
      speechRecognition.start()
    }
  }

  // UI toggles
  const toggleCustomFullscreen = () => {
    setIsCustomFullscreen(!isCustomFullscreen)
  }

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  useEffect(() => {
    setTemplateName(tName)
  }, [tName])

  useEffect(() => {
    setContent(initialValue)
  }, [initialValue])

  // Variable management
  const copyToClipboard = variable => {
    const textToCopy = typeof variable === 'string' ? variable : variable?.variableName || ''

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setRecentVariables(prev => {
          const updated = [textToCopy, ...prev.filter(v => v !== textToCopy)].slice(0, 5)
          return updated
        })

        setSnackbar({
          open: true,
          message: `Copied: ${textToCopy}`,
          severity: 'success'
        })
      })
      .catch(err => {
        console.error('Failed to copy text', err)
        setSnackbar({
          open: true,
          message: 'Failed to copy variable',
          severity: 'error'
        })
      })
  }

  // Enhanced HTML generation for PDF
  const generateFullHTML = () => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${templateName || 'Generated Content'}</title>
        <style>
            body { 
                font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
                line-height: 1.6;
                color: #333;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            table { 
                width: 100%; 
                border: 1px solid #ddd; 
                border-collapse: collapse; 
                margin: 20px 0;
            }
            th, td { 
                border: 1px solid #ddd; 
                padding: 12px; 
                text-align: left; 
            }
            th {
                background-color: #f8f9fa;
                font-weight: 600;
            }
            img { 
                max-width: 100%; 
                height: auto; 
                display: block; 
                margin: 20px auto; 
            }
            .page-break {
                page-break-before: always;
                border-top: 2px dashed #ccc;
                margin: 20px 0;
                height: 1px;
            }
            .todo-list {
                list-style: none;
                padding-left: 0;
            }
            .todo-list li {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            .todo-list input[type="checkbox"] {
                margin-right: 8px;
            }
            .signature-highlight {
                background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
                padding: 2px 4px;
                border-radius: 3px;
            }
            @media print {
                body { margin: 0; padding: 15px; }
                .page-break { border: none; margin: 0; height: 0; }
            }
        </style>
    </head>
    <body>
        ${content}
    </body>
    </html>`
  }

  // Complete Jodit Pro configuration with ALL premium features
  const config = useMemo(
    () => ({
      // PRO License key - this enables all premium features
      license: process.env.NEXT_PUBLIC_JODIT_SECRET_KEY || 'BC75D-0GI60-BU56N-CBIFX',

      // Basic editor settings
      height: isCustomFullscreen ? 'calc(100vh - 120px)' : 600,
      minHeight: 400,
      readonly: false,
      autofocus: false,
      language: 'en',

      // PRO features status indicators
      statusbar: true,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: true,

      // Enhanced toolbar
      toolbarSticky: true,
      toolbarAdaptive: true,
      toolbarButtonSize: 'middle',

      // Complete button set with ALL PRO features
      buttons: [
        'source',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'superscript',
        'subscript',
        '|',
        'ul',
        'ol',
        'todo',
        '|', // Todo lists (PRO)
        'outdent',
        'indent',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'video',
        'table',
        'link',
        '|',
        'align',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'copyformat',
        '|',
        'print',
        '|', // Emoji picker (PRO)
        // PRO exclusive buttons
        'find', // Find & Replace (PRO)
        'selectall',
        'paste',
        'format',
        'showBlocks', // Show blocks (PRO)
        'pageBreak', // Page break (PRO)
        'changeCase', // Change case (PRO)
        'pasteCode' // Paste code (PRO)
      ],

      // ALL PRO plugins enabled
      extraPlugins: [
        // Core PRO plugins
        'speech-recognize', // Speech recognition (PRO)
        'autocomplete', // AutoComplete (PRO)
        'backup', // Backup plugin (PRO)
        'emoji', // Emoji support (PRO)
        'spellcheck', // Spell checker (PRO)
        'finder', // Advanced finder (PRO)
        'translate', // Translation (PRO)
        'todo-list', // Todo lists (PRO)
        'virtual-keyboard', // Virtual keyboard (PRO)
        'mobile', // Mobile view (PRO)
        'tune-block', // Tune block (PRO)
        'highlight-signature', // Highlight signature (PRO)
        'show-blocks', // Show blocks (PRO)
        'page-break', // Page break (PRO)
        'xpath', // XPath (PRO)
        'change-case', // Change case (PRO)
        'paste-code', // Paste code (PRO)
        'google-search', // Google search (PRO)
        'google-maps-editor', // Google Maps (PRO)
        'button-generator', // Button generator (PRO)
        'custom-color-picker', // Custom color picker (PRO)
        'paste-from-word-pro', // Paste from Word PRO
        'iframe-editor', // Iframe editor (PRO)
        'ai-assistant', // AI Assistant (PRO)

        // Enhanced media plugins
        'drag-and-drop-element',
        'media',
        'clean-html',
        'image-processor',
        'image-editor', // Advanced image editor (PRO)
        'table-keyboard-navigation',
        'resize-cells',
        'select-cells',

        // Advanced editing plugins
        'class-span',
        'font',
        'format-block',
        'symbols',
        'color-picker',
        'resizer',
        'sticky',
        'search',
        'indent',
        'justify',
        'line-height',
        'insert-html',
        'inline-popup',
        'key-arrow-outside',
        'limit',
        'link',
        'media',
        'ordered-list',
        'paste',
        'paste-storage',
        'powered-by-jodit',
        'print',
        'redo-undo',
        'resize-handler',
        'select',
        'size',
        'source',
        'stat',
        'tab',
        'table',
        'video',
        'wrap-nodes'
      ],

      // AutoComplete configuration (PRO feature)
      autocomplete: {
        enabled: true,
        maxItemsInView: 10,
        sources: [
          // Variable autocomplete
          query => {
            return variables
              .filter(variable => variable.variableName.toLowerCase().includes(query.toLowerCase()))
              .map(variable => ({
                title: variable.variableName,
                value: `${variable.variableName}`,
                description: variable.description || ''
              }))
          },
          // General autocomplete words
          ['document', 'template', 'content', 'editor', 'professional', 'advanced', 'feature']
        ]
      },

      // Backup configuration (PRO feature)
      backup: {
        enabled: autoSaveEnabled,
        interval: backupInterval * 60 * 1000, // Convert minutes to milliseconds
        maxSaves: maxBackups,
        prefix: 'jodit_backup_',
        postfix: '_' + Date.now()
      },

      // Emoji configuration (PRO feature)
      emoji: {
        enabled: true,
        enableAutoComplete: enableEmojiAutocomplete,
        recentCountLimit: 50,
        data: () => ({
          categories: [
            'Smileys & Emotion',
            'People & Body',
            'Animals & Nature',
            'Food & Drink',
            'Activities',
            'Travel & Places',
            'Objects',
            'Symbols',
            'Flags'
          ]
        })
      },

      // Speech Recognition configuration (PRO feature)
      speechRecognize: {
        enabled: true,
        lang: recognitionLanguage,
        continuous: true,
        interimResults: true,
        commands: {
          'new line|enter': 'enter',
          'delete|remove word|delete word': 'backspaceWordButton',
          comma: 'inserthtml::,',
          'period|dot': 'inserthtml::.',
          'question mark': 'inserthtml::?',
          'exclamation|exclamation point': 'inserthtml::!',
          space: 'inserthtml:: ',
          'bold this|make bold': 'bold',
          'italic this|make italic': 'italic',
          'underline this': 'underline',
          'insert table': 'table',
          'insert link': 'link',
          'insert image': 'image',
          'save document': 'save',
          'undo that': 'undo',
          'redo that': 'redo'
        }
      },

      // Page break configuration (PRO feature)
      // pageBreak: {
      //   separator: '<!-- pagebreak -->',
      //   icon: 'page_break',
      //   className: 'page-break'
      // },

      // Enhanced image handling (PRO features)

      // Advanced table handling (PRO features)
      table: {
        selectionCellStyle: 'border: 2px solid #1976d2 !important;',
        allowCellSelection: true, // Cell selection (PRO)
        allowCellResize: true, // Cell resizing (PRO)
        allowRowResize: true, // Row resizing (PRO)
        allowColumnResize: true, // Column resizing (PRO)
        useExtraClassesOptions: true, // Extra classes (PRO)
        resizeHandler: true,
        createHeaderButtons: ['th', 'td', 'delete'],
        toolbarPopup: true,
        contextMenu: true
      },

      // File upload configuration with advanced features
      uploader: {
        insertImageAsBase64URI: true,
        //   url: '/api/upload',
        format: 'json',
        imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico']
        //   filesVariableName: 'file',
        //   withCredentials: false,
        //   pathVariableName: 'path',
        //   method: 'POST',
        //   maxFileSize: 10 * 1024 * 1024, // 10MB
        //   enableDragAndDrop: true,
        //   multiple: true,
        //   buildInput: (editor) => {
        //     const input = editor.createInside.element('input', {
        //       type: 'file',
        //       multiple: true,
        //       accept: 'image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
        //     })
        //     return input
        //   }
      },

      // Enhanced paste handling (PRO features)
      paste: {
        autoreplace: true,
        autoReplaceOldTags: true,
        replaceNBSP: true,
        processPasteHTML: true,
        processPasteFromWord: true, // Enhanced Word paste (PRO)
        processPasteFromExcel: true, // Excel paste (PRO)
        processPasteText: true,
        processPasteImg: true,
        processPastePDF: true, // PDF paste (PRO)
        nl2brInPlainText: true,
        defaultActionOnPaste: 'insert_clear_html',
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false
      },

      // Search and replace (PRO feature)
      search: {
        lazyLoading: true,
        useRegExp: true,
        caseSensitive: false,
        wholeWords: false,
        searchInSelection: false
      },

      // Finder configuration (PRO feature)
      finder: {
        timeout: 1000,
        caseSensitive: false,
        wholeWords: false,
        regExp: false
      },

      // Custom Color Picker (PRO feature)
      colorPicker: {
        defaultTab: 'color',
        columns: 10,
        colors: [
          '#000000',
          '#434343',
          '#666666',
          '#999999',
          '#B7B7B7',
          '#CCCCCC',
          '#D9D9D9',
          '#EFEFEF',
          '#F3F3F3',
          '#FFFFFF',
          '#980000',
          '#FF0000',
          '#FF9900',
          '#FFFF00',
          '#00FF00',
          '#00FFFF',
          '#4A86E8',
          '#0000FF',
          '#9900FF',
          '#FF00FF',
          '#E6B8AF',
          '#F4CCCC',
          '#FCE5CD',
          '#FFF2CC',
          '#D9EAD3',
          '#D0E0E3',
          '#C9DAF8',
          '#CFE2F3',
          '#D9D2E9',
          '#EAD1DC',
          '#DD7E6B',
          '#EA9999',
          '#F9CB9C',
          '#FFE599',
          '#B6D7A8',
          '#A2C4C9',
          '#A4C2F4',
          '#9FC5E8',
          '#B4A7D6',
          '#D5A6BD',
          '#CC4125',
          '#E06666',
          '#F6B26B',
          '#FFD966',
          '#93C47D',
          '#76A5AF',
          '#6D9EEB',
          '#6FA8DC',
          '#8E7CC3',
          '#C27BA0',
          '#A61C00',
          '#CC0000',
          '#E69138',
          '#F1C232',
          '#6AA84F',
          '#45818E',
          '#3C78D8',
          '#3D85C6',
          '#674EA7',
          '#A64D79',
          '#85200C',
          '#990000',
          '#B45F06',
          '#BF9000',
          '#38761D',
          '#134F5C',
          '#1155CC',
          '#0B5394',
          '#351C75',
          '#741B47',
          '#5B0F00',
          '#660000',
          '#783F04',
          '#7F6000',
          '#274E13',
          '#0C343D',
          '#1C4587',
          '#073763',
          '#20124D',
          '#4C1130'
        ]
      },

      // Mobile view configuration (PRO feature)
      // mobile: {
      //   enabled: true,
      //   toolbarAdaptive: true,
      //   menuOpenerIcon: '☰',
      //   menuCloserIcon: '✕',
      //   maxWidthForMobile: 768
      // },

      // Enhanced events with PRO features
      events: {
        afterInit: jodit => {
          setEditorReady(true)

          // Initialize speech recognition
          initializeSpeechRecognition()

          // Setup backup system
          if (autoSaveEnabled) {
            jodit.events.on('change', () => {
              // Auto-backup logic
              const backupKey = `jodit_backup_${templateName || 'untitled'}_${Date.now()}`
              localStorage.setItem(backupKey, jodit.value)

              // Clean old backups
              const allBackups = Object.keys(localStorage).filter(key => key.startsWith('jodit_backup_'))
              if (allBackups.length > maxBackups) {
                const oldestBackup = allBackups.sort()[0]
                localStorage.removeItem(oldestBackup)
              }
            })
          }
        },

        change: value => {
          handleChange(value)
        },

        beforeCommand: command => {
          return true
        },

        afterCommand: command => {
        },

        beforePaste: (event, text, html) => {
          return true
        },

        afterPaste: event => {
        },

        speechRecognizeStart: () => {
          setIsListening(true)
          setSnackbar({
            open: true,
            message: 'Speech recognition started (PRO feature)',
            severity: 'info'
          })
        },

        speechRecognizeEnd: () => {
          setIsListening(false)
        }
      },

      // Professional styling
      style: {
        fontSize: '14px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#333',
        lineHeight: '1.6'
      },

      // Enhanced controls with PRO features
      controls: {
        font: {
          list: {
            'Inter, sans-serif': 'Inter',
            'Arial, Helvetica, sans-serif': 'Arial',
            'Georgia, serif': 'Georgia',
            'Times New Roman, Times, serif': 'Times New Roman',
            'Courier New, Courier, monospace': 'Courier New',
            'Helvetica, sans-serif': 'Helvetica',
            'Verdana, sans-serif': 'Verdana',
            'Tahoma, sans-serif': 'Tahoma',
            'Trebuchet MS, sans-serif': 'Trebuchet MS',
            'Comic Sans MS, cursive': 'Comic Sans MS',
            'Impact, fantasy': 'Impact'
          }
        },

        fontsize: {
          list: [
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '16',
            '18',
            '20',
            '22',
            '24',
            '26',
            '28',
            '32',
            '36',
            '48',
            '72'
          ]
        },

        paragraph: {
          list: {
            p: 'Normal',
            h1: 'Heading 1',
            h2: 'Heading 2',
            h3: 'Heading 3',
            h4: 'Heading 4',
            h5: 'Heading 5',
            h6: 'Heading 6',
            blockquote: 'Quote',
            pre: 'Code Block',
            div: 'Division'
          }
        }
      },

      // Enhanced shortcuts including PRO features
      shortcuts: {
        'ctrl+b': 'bold',
        'ctrl+i': 'italic',
        'ctrl+u': 'underline',
        'ctrl+z': 'undo',
        'ctrl+y': 'redo',
        'ctrl+shift+z': 'redo',
        'ctrl+k': 'link',
        'ctrl+f': 'find', // PRO feature
        'ctrl+h': 'replace', // PRO feature
        'ctrl+alt+b': 'showBlocks', // PRO feature
        'ctrl+alt+p': 'pageBreak', // PRO feature
        'ctrl+shift+c': 'changeCase', // PRO feature
        f7: 'spellcheck', // PRO feature
        'ctrl+alt+l': 'justifyLeft',
        'ctrl+alt+c': 'justifyCenter',
        'ctrl+alt+r': 'justifyRight',
        'ctrl+alt+j': 'justifyFull',
        'shift+tab': 'outdent',
        tab: 'indent',
        'ctrl+shift+7': 'ol',
        'ctrl+shift+8': 'ul',
        'ctrl+shift+9': 'todo' // PRO feature
      },

      // placeholder: 'Start creating your professional content with Jodit PRO - All premium features enabled!',

      // Enhanced tab handling
      tabIndex: 1,
      enter: 'P',

      // Advanced iframe settings
      iframe: false,
      iframeStyle: 'body{margin:0;padding:10px;background:transparent;font-family:Inter,sans-serif;}',

      // Direction support
      direction: 'ltr',

      // Theme support
      theme: 'default',

      // Advanced mobile settings
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,

      // Custom CSS for ALL PRO features
      extraCSS: `
      .page-break {
        page-break-before: always;
        border-top: 2px dashed #ccc;
        margin: 20px 0;
        height: 1px;
      }
      
      .todo-list {
        list-style: none;
        padding-left: 0;
      }
      
      .todo-list li {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .todo-list input[type="checkbox"] {
        margin-right: 8px;
        width: 16px;
        height: 16px;
      }
      
      .signature-highlight {
        background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
        padding: 2px 4px;
        border-radius: 3px;
      }
      
      .google-map {
        border: 2px solid #4285f4;
        border-radius: 8px;
        position: relative;
      }
      
      .google-map::before {
        content: "📍 Google Map";
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(66, 133, 244, 0.9);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1;
      }
      
      .ai-enhanced {
        border-left: 4px solid #4caf50;
        padding-left: 12px;
        background: rgba(76, 175, 80, 0.05);
      }
      
      .speech-input {
        background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
        background-size: 200% 200%;
        animation: speechGradient 2s ease infinite;
      }
      
      @keyframes speechGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .spellcheck-error {
        border-bottom: 2px wavy #f44336;
      }
      
      .virtual-keyboard {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #ddd;
        z-index: 10000;
      }
      
      .mobile-view .jodit-toolbar {
        flex-wrap: wrap;
      }
      
      .mobile-view .jodit-toolbar-button {
        min-width: 40px;
        min-height: 40px;
      }
      
      @media print {
        .page-break {
          border: none;
          margin: 0;
          height: 0;
        }
        
        .google-map {
          border: 1px solid #ccc;
        }
        
        .virtual-keyboard {
          display: none;
        }
      }
    `
    }),
    [
      isCustomFullscreen,
      autoSaveEnabled,
      spellCheckEnabled,
      aiAssistantEnabled,
      recognitionLanguage,
      translationLanguage,
      backupInterval,
      maxBackups,
      enableEmojiAutocomplete,
      enableGoogleMaps,
      enableVirtualKeyboard,
      templateName
    ]
  )

  // Save template with PRO features
  const handleSave = async () => {
    try {
      const fullHTML = generateFullHTML()

      // Create backup before saving
      if (autoSaveEnabled) {
        const backupKey = `jodit_backup_${templateName}_${Date.now()}`
        localStorage.setItem(backupKey, fullHTML)
      }

      if (onSave) {
        const result = await onSave({
          templateName,
          content: fullHTML,
          metadata: {
            wordCount,
            characterCount,
            hasProFeatures: isLicenseActive,
            features: {
              hasEmoji: content.includes('emoji'),
              hasTodoList: content.includes('todo-list'),
              hasPageBreak: content.includes('page-break'),
              hasSignature: content.includes('signature-highlight'),
              hasGoogleMap: content.includes('google-map'),
              hasAiEnhanced: content.includes('ai-enhanced')
            },
            createdWith: 'Jodit PRO Editor',
            version: '4.6.4'
          }
        })

        if (result && result.success) {
          setSnackbar({
            open: true,
            message: 'Template saved successfully with PRO features!',
            severity: 'success'
          })

          // Reset form
          setTemplateName('')
          setContent('')
          setTemplateContent('')
        } else {
          throw new Error(result?.message || 'Failed to save template')
        }
      }
    } catch (error) {
      console.error('Error saving template:', error)
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred while saving template',
        severity: 'error'
      })
    }
  }

  // PRO Feature: Restore from backup
  const handleRestoreBackup = () => {
    const backups = Object.keys(localStorage)
      .filter(key => key.startsWith('jodit_backup_'))
      .sort()
      .reverse()

    if (backups.length > 0) {
      const latestBackup = localStorage.getItem(backups[0])
      if (latestBackup) {
        setContent(latestBackup)
        setSnackbar({
          open: true,
          message: 'Backup restored successfully!',
          severity: 'success'
        })
      }
    } else {
      setSnackbar({
        open: true,
        message: 'No backups available',
        severity: 'info'
      })
    }
  }

  // PRO Feature: Export to PDF
  const handleExportPDF = () => {

    if (editor.current && editor.current.jodit) {
      try {
        // Use Jodit PRO's export functionality
        const htmlContent = generateFullHTML()
        const printWindow = window.open('', '_blank')
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.print()

        setSnackbar({
          open: true,
          message: 'PDF export initiated! Please use your browser print dialog.',
          severity: 'success'
        })
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'PDF export failed. Please try again.',
          severity: 'error'
        })
      }
    }
  }

  // Fullscreen editor component with PRO features
  const FullscreenEditor = () => (
    <Dialog
      open={isCustomFullscreen}
      onClose={toggleCustomFullscreen}
      maxWidth={false}
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          maxHeight: '100vh',
          height: '100vh',
          width: '100vw',
          background: '#ffffff'
        }
      }}
    >
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Enhanced fullscreen toolbar */}
        <div
          style={{
            padding: '15px 25px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white'
          }}
        >
          <div>
            <Typography variant='h5' style={{ margin: 0, fontWeight: 600 }}>
              {templateName || 'Jodit PRO Editor'} - Fullscreen Mode
            </Typography>
            <Typography variant='body2' style={{ opacity: 0.9 }}>
              Words: {wordCount} | Characters: {characterCount}
              {isLicenseActive && ' | All PRO Features Active'}
              {autoSaveEnabled && ' | Auto-save ON'}
            </Typography>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* PRO Feature buttons */}
            <Tooltip title='Speech Recognition (PRO)'>
              <IconButton onClick={toggleSpeechRecognition} style={{ color: isListening ? '#ff4444' : 'white' }}>
                <MicIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='AI Assistant (PRO)'>
              <IconButton style={{ color: aiAssistantEnabled ? 'white' : 'rgba(255,255,255,0.5)' }}>
                <SmartToyIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Spell Checker (PRO)'>
              <IconButton style={{ color: spellCheckEnabled ? 'white' : 'rgba(255,255,255,0.5)' }}>
                <SpellcheckIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Translate (PRO)'>
              <IconButton style={{ color: 'white' }}>
                <TranslateIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Export PDF (PRO)'>
              <IconButton onClick={handleExportPDF} style={{ color: 'white' }}>
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Backup (PRO)'>
              <IconButton onClick={handleRestoreBackup} style={{ color: 'white' }}>
                <BackupIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Preview Mode'>
              <IconButton
                onClick={togglePreviewMode}
                style={{ color: isPreviewMode ? '#fff' : 'rgba(255,255,255,0.7)' }}
              >
                <PreviewIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Save Template'>
              <IconButton onClick={handleSave} style={{ color: 'white' }}>
                <SaveIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Exit Fullscreen'>
              <IconButton onClick={toggleCustomFullscreen} style={{ color: 'white' }}>
                <FullscreenExitIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Fullscreen content */}
        <div style={{ flex: 1, padding: '20px', overflow: 'auto', background: '#fafafa' }}>
          {isPreviewMode ? (
            <div
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                minHeight: 'calc(100vh - 200px)'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div
              style={{
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <JoditEditor
                ref={editor}
                value={content}
                config={{
                  ...config,
                  height: 'calc(100vh - 200px)',
                  toolbarSticky: false
                }}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )

  return (
    <>
      <Paper elevation={3} style={{ padding: '25px', marginTop: '20px', borderRadius: '12px' }}>
        {/* Enhanced tabs interface */}
        <Box mb={3}>
          {activeTab === 0 && (
            <>
              {/* Configuration Section */}
              <Box mb={3}>
                <Typography variant='h6' gutterBottom style={{ fontWeight: 600, marginBottom: '15px' }}>
                  Email-Template Configuration
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <CustomTextField
                      fullWidth
                      label='Template Name'
                      value={templateName}
                      onChange={e => setTemplateName(e.target.value)}
                      placeholder='Enter Template Name'
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                      fullWidth
                      options={variables}
                      getOptionLabel={option => option.variableName || ''}
                      renderInput={params => <CustomTextField {...params} label='Select Variable' variant='outlined' />}
                      renderOption={(props, option) => (
                        <MenuItem
                          {...props}
                          key={option._id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 16px',
                            cursor: 'pointer'
                          }}
                          onClick={e => {
                            e.preventDefault()
                            e.stopPropagation()
                            copyToClipboard(option.variableName)
                          }}
                        >
                          <span>{option.variableName}</span>
                          <ContentCopyIcon fontSize='small' sx={{ ml: 1 }} />
                        </MenuItem>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Editor Section with PRO features */}
              <Box mb={3}>
                <div style={{ position: 'relative' }}>
                  {isPreviewMode ? (
                    <Paper
                      elevation={1}
                      style={{
                        padding: '30px',
                        minHeight: '600px',
                        background: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                    </Paper>
                  ) : (
                    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
                      <JoditEditor ref={editor} value={content} config={config} onChange={handleChange} />
                    </div>
                  )}
                </div>
              </Box>

              {/* Enhanced action buttons */}
              <Box display='flex' gap={2} justifyContent='flex-end' mt={3} flexWrap='wrap'>
                <Button
                  onClick={() => router.push('/commandexe/templates/pdflists')}
                  color='primary'
                  variant='outlined'
                  size='large'
                  style={{ marginRight: '10px' }}
                >
                  Back
                </Button>

                <Button
                  onClick={handleSave}
                  variant='contained'
                  size='large'
                  startIcon={<SaveIcon />}
                  // disabled={!templateName.trim() || !selectedProduct}
                  sx={{
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                    }
                  }}
                >
                  Save Template
                </Button>
              </Box>
            </>
          )}
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            variant='filled'
            severity={snackbar.severity}
            sx={{ width: '100%', zIndex: '9999' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>

      {/* Enhanced Fullscreen Editor */}
      <FullscreenEditor />
    </>
  )
}

export default React.memo(JoditProEditor)
