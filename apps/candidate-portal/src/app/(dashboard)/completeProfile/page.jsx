"use client"

import { useEffect, useState, useRef } from "react"
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Skeleton,
  Checkbox,
  FormControlLabel,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Avatar,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel
} from "@mui/material"
import {
  CloudUpload,
  CheckCircle,
  PictureAsPdf,
  InsertDriveFile,
  Image as ImageIcon,
  Visibility,
  Description,
  Article,
  Badge as BadgeIcon,
  Work,
  School,
  Email,
  Add as AddIcon,
  Save,
  AttachMoney,
  Delete as DeleteIcon,
  Psychology,
  Info,
  Close as CloseIcon,
  ExpandMore,
  CameraAlt,
} from "@mui/icons-material"
import axios from "axios"

// Complete document types configuration based on API response
const DOCUMENT_TYPES = {
  resume: {
    icon: <Description />,
    color: "#f44336",
    bgColor: "#ffebee",
    label: "Resume",
    acceptedFormats: ".pdf,.doc,.docx",
    required: true,
    apiKey: "resume",
  },
  Aadhaar_front: {
    icon: <BadgeIcon />,
    color: "#2196f3",
    bgColor: "#e3f2fd",
    label: "Aadhaar Front",
    acceptedFormats: ".jpg,.jpeg,.png,.pdf",
    required: true,
    apiKey: "Aadhaar_front",
  },
  Aadhar_Back: {
    icon: <BadgeIcon />,
    color: "#2196f3",
    bgColor: "#e3f2fd",
    label: "Aadhaar Back",
    acceptedFormats: ".jpg,.jpeg,.png,.pdf",
    required: true,
    apiKey: "Aadhar_Back",
  },
  pancard: {
    icon: <Article />,
    color: "#ff9800",
    bgColor: "#fff3e0",
    label: "PAN Card",
    acceptedFormats: ".jpg,.jpeg,.png,.pdf",
    required: true,
    apiKey: "pancard",
  },
  voterId: {
    icon: <Article />,
    color: "#9c27b0",
    bgColor: "#f3e5f5",
    label: "Voter ID",
    acceptedFormats: ".jpg,.jpeg,.png,.pdf",
    required: false,
    apiKey: "voterId",
  },
  DrivingLicence: {
    icon: <Article />,
    color: "#4caf50",
    bgColor: "#e8f5e9",
    label: "Driving Licence",
    acceptedFormats: ".jpg,.jpeg,.png,.pdf",
    required: false,
    apiKey: "DrivingLicence",
  },
  passportsizephoto: {
    icon: <ImageIcon />,
    color: "#ff5722",
    bgColor: "#fbe9e7",
    label: "Passport Photo",
    acceptedFormats: ".jpg,.jpeg,.png",
    required: true,
    apiKey: "passportsizephoto",
  },
  salarysleep: {
    icon: <Work />,
    color: "#4caf50",
    bgColor: "#e8f5e9",
    label: "Last 3 Month's Salary Slips",
    acceptedFormats: ".jpg,.jpeg,.png,.pdf",
    required: false,
    apiKey: "salarysleep",
    isArray: true,
    maxFiles: 12,
  },
  appointmentletter: {
    icon: <Article />,
    color: "#9c27b0",
    bgColor: "#f3e5f5",
    label: "Appointment Letter",
    acceptedFormats: ".pdf",
    required: false,
    apiKey: "appointmentletter",
  },
  Relievingletter: {
    icon: <Article />,
    color: "#795548",
    bgColor: "#efebe9",
    label: "Relieving Letter",
    acceptedFormats: ".pdf",
    required: false,
    apiKey: "Relievingletter",
  },
  experinceletter: {
    icon: <Article />,
    color: "#607d8b",
    bgColor: "#eceff1",
    label: "Experience Letter",
    acceptedFormats: ".pdf",
    required: false,
    apiKey: "experinceletter",
  },
  Incrementletter: {
    icon: <Article />,
    color: "#ff9800",
    bgColor: "#fff3e0",
    label: "Increment Letter",
    acceptedFormats: ".pdf",
    required: false,
    apiKey: "Incrementletter",
  },
  certificate: {
    icon: <School />,
    color: "#ff5722",
    bgColor: "#fbe9e7",
    label: "Education Certificate",
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    required: false,
    apiKey: "certificate",
  },
  BankStatment: {
    icon: <Description />,
    color: "#00bcd4",
    bgColor: "#e0f2f1",
    label: "Bank Statement",
    acceptedFormats: ".pdf",
    required: false,
    apiKey: "BankStatment",
  },
  ElectricityBill: {
    icon: <Description />,
    color: "#ffc107",
    bgColor: "#fffde7",
    label: "Electricity Bill",
    acceptedFormats: ".pdf,.jpg,.jpeg,.png",
    required: false,
    apiKey: "Address_proof.ElectricityBill",
  },
  RentAgreement: {
    icon: <Description />,
    color: "#3f51b5",
    bgColor: "#e8eaf6",
    label: "Rent Agreement",
    acceptedFormats: ".pdf",
    required: false,
    apiKey: "Address_proof.RentAgreement",
  },
  BGV_Documents: {
    icon: <Description />,
    color: "#e91e63",
    bgColor: "#fce4ec",
    label: "BGV Documents",
    acceptedFormats: ".pdf",
    required: false,
    apiKey: "Address_proof.BGV_Documents",
  },
  Others: {
    icon: <InsertDriveFile />,
    color: "#9e9e9e",
    bgColor: "#f5f5f5",
    label: "Other Documents",
    acceptedFormats: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
    required: false,
    apiKey: "Others",
    isArray: true,
  },
}

// Dropdown options
const DROPDOWN_OPTIONS = {
  gender: ["Male", "Female", "Other"],
  maritalStatus: ["Single", "Married", "Divorced", "Widowed"],
  bloodGroup: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  employmentType: ["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"],
  educationType: ["10th Standard", "12th Standard", "Diploma", "Graduation", "Post Graduation", "PhD"],
  religion: ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"],
  category: ["General", "OBC", "SC", "ST", "Other"],
  nationality: ["Indian", "Other"],
  relation: ["Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister", "Other"],
  jobType: ["Full-Time", "Part-Time", "Contract", "Freelance", "Remote"],
  nominationType: ["Primary", "Secondary"],
  currentEmployer: ["Yes", "No"],
  converUnderpf: ["true", "false"],
  currentlyStudent: ["true", "false"],
}

// Tab configuration mapping stage keys to tab info
const TAB_CONFIG = {
  basic_info: {
    label: "Basic Details",
    icon: <Email />,
  },
  SkillInfo: {
    label: "Skills",
    icon: <Psychology />,
  },
  professional_experience: {
    label: "Experience",
    icon: <Work />,
  },
  education: {
    label: "Education",
    icon: <School />,
  },
  KYC_Details: {
    label: "KYC",
    icon: <BadgeIcon />,
  },
  family_info: {
    label: "Family & Nominees",
    icon: <Work />,
  },
  Bank_verification: {
    label: "Bank",
    icon: <AttachMoney />,
  },

  Personal_Documents: {
    label: "Documents",
    icon: <Description />,
  },

  OtherInformation: {
    label: "Other Information",
    icon: <Info />,
  },
}

const CandidateProfile = ({ candidateId }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.example.com"
  const fileInputRef = useRef(null)

  // Get token from localStorage
  const [token, setToken] = useState("")
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(window.localStorage.getItem("authToken") || "")
    }
  }, [])

  // Form stages state
  const [formStages, setFormStages] = useState([])
  const [selectedStage, setSelectedStage] = useState("")
  const [activeStageKeys, setActiveStageKeys] = useState([])
  const [availableTabs, setAvailableTabs] = useState([])

  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [pageLoaded, setPageLoaded] = useState(false)

  // New state variables
  const [resumeModal, setResumeModal] = useState(true)
  // const [resumeUrl, setResumeUrl] = useState(true)

  const [uploadedFile, setUploadedFile] = useState(null)
  const inputRef = useRef()
  const [aiResponseData, setAiResponseData] = useState({})
  const [fetching, setFetching] = useState(false)
  const [parse, setParse] = useState(false)
  const [previousFormData, setPreviousFormData] = useState(null)
  const [hasSkippedResume, setHasSkippedResume] = useState(false)
  const [showMissingFieldsDialog, setShowMissingFieldsDialog] = useState(false)

  // Form state management - Complete structure based on API response
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobileNumber: "",
    coverPhoto: "",
    profilePicture: "",
    resume: "",
    summary: "",
    aboutUs: "",
    resumeDetails: {
      originalFileName: "",
      uploadedAt: null,
      parsedKeywords: [],
    },
    Basic_Info: {
      Name: "",
      email: "",
      gender: "",
      dob: null,
      fatherName: "",
      MotherName: "",
      maritalStatus: "",
      EmergencyNumber: "",
      EmergencyContact: "",
      RelationwihContact: "",
      Nationality: "",
      identityMark: "",
      height: "",
      caste: "",
      landmark: "",
      category: "",
      religion: "",
      bloodGroup: "",
      homeDistrict: "",
      homeState: "",
      nearestRailwaySt: "",
      Reference: "",
      socialAccounts: [],
      ResumeAddress: '',
      CurrentAddress: {
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
      PermentAddress: {
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      },
    },
    Family_Info: {
      fatherName: "",
      motherName: "",
      fathersOccupation: "",
      fathersMobileNo: "",
      mothersMobileNo: "",
      familyIncome: "",
      familymember: "",
    },
    professional_Experience: [],
    KYC_Details: {
      pancardNo: "",
      aadharcardNo: "",
      passportNo: "",
      uanNumber: "",
      VoterId: "",
    },
    education: [],
    Personal_Documents: {
      Aadhaar_front: "",
      Aadhar_Back: "",
      pancard: "",
      voterId: "",
      DrivingLicence: "",
      passportsizephoto: "",
      appointmentletter: '',
      Relievingletter: '',
      experinceletter: '',
      Incrementletter: '',
      Address_proof: [
        {
          ElectricityBill: "",
          RentAgreement: "",
          BGV_Documents: "",
        },
      ],
      Others: [],
    },
    Bank_verification: {
      account_number: "",
      ifsc: "",
      bank_name: "",
      name: "",
      city: "",
      branch: "",
      uan: "",
      EsicNumber: "",
      converUnderpf: "false",
      BankStatment: "",
    },
    nominee: [],
    jobAlerts: [],
    SkillInfo: {

      skills: [],
      languagesKnown: [],
    },
    // jobPreferences: {
    //   preferredLocations: [],
    //   jobType: "",
    //   noticePeriodInDays: "",
    // },
    expectedSalary: "",
    currentCTC: "",
    Reasonforleaving: "",
    profileCompletionPercentage: 0,
    Resume_Analizer: "",
    others: [],
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // New state for adding skills, languages, etc.
  const [newSkill, setNewSkill] = useState("")
  const [newLanguage, setNewLanguage] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newJobAlert, setNewJobAlert] = useState("")
  const [newSocialAccount, setNewSocialAccount] = useState("")

  // API Functions
  const getFormStages = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v1/api/formStageset/getAllFormStages`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      if (res.data.status) {
        const stages = res.data.items
        setFormStages(stages)

        // Set default stage (first one)
        if (stages.length > 0) {
          setSelectedStage(stages[0].stageName)
          updateActiveStageKeys(stages[0])
        }

        setSnackbar({
          open: true,
          message: "Form stages loaded successfully!",
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Error fetching form stages:", error)
      setSnackbar({
        open: true,
        message: "Failed to load form stages. Please try again.",
        severity: "error",
      })
    }
  }

  const updateActiveStageKeys = (stage) => {
    // Extract active stage keys
    const baseKeys = stage.stages
      .filter((stageItem) => stageItem.isActive)
      .map((stageItem) => stageItem.stageKey);

    // Ensure 'skills' at index 1 and 'otherInformation' at the end

    let activeKeys = [...baseKeys];

    // if (!activeKeys.includes("skills")) {
    //   activeKeys.splice(1, 0, "skills"); // Insert 'skills' at index 1
    // }

    // if (!activeKeys.includes("otherInformation")) {
    //   activeKeys.push("otherInformation"); // Always last
    // }

    setActiveStageKeys(activeKeys);

    // Order tabs based on TAB_CONFIG key order
    const orderedKeys = Object.keys(TAB_CONFIG).filter((key) =>
      activeKeys.includes(key)
    );

    const tabs = orderedKeys
      .map((key) => ({
        key,
        ...TAB_CONFIG[key],
      }))
      .filter((tab) => tab.label);

    setAvailableTabs(tabs);
    setActiveTab(0);
  };



  const handleStageChange = (event) => {
    const stageName = event.target.value
    setSelectedStage(stageName)

    const stage = formStages.find((s) => s.stageName === stageName)
    if (stage) {
      updateActiveStageKeys(stage)
    }
  }

  const getCandidateProfile = async () => {
    setInitialLoading(true)
    try {
      const res = await axios.get(`${baseUrl}/v1/api/Auth/viewprofile`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })

      if (res.data.status) {
        const response = res.data.items
        setFormData(response)
        const percent = calculateProfileCompletion(response)
        setProgressPercentage(percent)

        if (response.Basic_Info?.CurrentAddress && response.Basic_Info?.PermentAddress) {
          const currentAddr = response.Basic_Info.CurrentAddress
          const permAddr = response.Basic_Info.PermentAddress
          const isSame = JSON.stringify(currentAddr) === JSON.stringify(permAddr)
          setSameAsCurrentAddress(isSame)
        }

        setSnackbar({
          open: true,
          message: "Profile data loaded successfully!",
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
      setSnackbar({
        open: true,
        message: "Failed to load profile data. Please try again.",
        severity: "error",
      })
    } finally {
      setInitialLoading(false)
      setLoading(false)
      setTimeout(() => setPageLoaded(true), 500)
    }
  }

  const calculateProfileCompletion = (userData) => {
    const requiredFields = [
      !!userData.userName,
      !!userData.email,
      !!userData.fullName,

      !!userData.mobileNumber,
      !!userData.Basic_Info?.gender,
      !!userData.Basic_Info?.dob,
    ]

    const requiredDocs = [
      !!userData.resume,
      !!userData.Personal_Documents?.Aadhaar_front,
      !!userData.Personal_Documents?.Aadhar_Back,
      !!userData.Personal_Documents?.pancard,
    ]

    const completedFields = requiredFields.filter(Boolean).length
    const completedDocs = requiredDocs.filter(Boolean).length

    const totalRequired = requiredFields.length + requiredDocs.length
    const totalCompleted = completedFields + completedDocs
    const percentage = Math.round((totalCompleted / totalRequired) * 100)

    return percentage
  }

  // Load data on component mount
  useEffect(() => {
    if (token) {
      getFormStages()
      getCandidateProfile()
    }
  }, [token])

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const formatDate = (date) => {
    if (!date) return ""

    // Handle different date formats
    let dateObj
    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === "string" || typeof date === "number") {
      dateObj = new Date(date)
    } else {
      return ""
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return ""
    }

    return dateObj.toISOString().split("T")[0]
  }

  // Field categories for handling changes
  const basicInfoFields = [
    "Name",
    "email",
    "gender",
    "dob",
    "fatherName",
    "MotherName",
    "maritalStatus",
    "EmergencyNumber",
    "EmergencyContact",
    "RelationwihContact",
    "Nationality",
    "identityMark",
    "height",
    "caste",
    "landmark",
    "category",
    "religion",
    "bloodGroup",
    "homeDistrict",
    "homeState",
    "nearestRailwaySt",
    "Reference",
    "ResumeAddress"
  ]

  const familyFields = [
    "fatherName",
    "motherName",
    "fathersOccupation",
    "fathersMobileNo",
    "mothersMobileNo",
    "familyIncome",
    "familymember",
  ]

  const kycFields = ["pancardNo", "aadharcardNo", "passportNo", "uanNumber", "VoterId"]

  const bankFields = [
    "account_number",
    "ifsc",
    "bank_name",
    "name",
    "city",
    "branch",
    "uan",
    "EsicNumber",
    "converUnderpf",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    if (familyFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        Family_Info: {
          ...prev.Family_Info,
          [name]: value,
        },
      }))
    } else if (basicInfoFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        Basic_Info: {
          ...prev.Basic_Info,
          [name]: value,
        },
      }))
    } else if (kycFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        KYC_Details: {
          ...prev.KYC_Details,
          [name]: value,
        },
      }))
    } else if (bankFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        Bank_verification: {
          ...prev.Bank_verification,
          [name]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleAddressChange = (addressType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      Basic_Info: {
        ...prev.Basic_Info,
        [addressType]: {
          ...prev.Basic_Info[addressType],
          [field]: value,
        },
      },
    }))
  }

  const handleJobPreferenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        [field]: value,
      },
    }))
  }

  const handleSameAsCurrentAddress = (checked) => {
    setSameAsCurrentAddress(checked)
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        Basic_Info: {
          ...prev.Basic_Info,
          PermentAddress: {
            ...prev.Basic_Info.CurrentAddress,
          },
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        Basic_Info: {
          ...prev.Basic_Info,
          PermentAddress: {
            address1: "",
            address2: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
          },
        },
      }))
    }
  }

  // Experience handlers
  const handleExperienceChange = (e, index) => {
    const { name, value } = e.target
    const updated = [...formData.professional_Experience]
    updated[index][name] = value
    setFormData({ ...formData, professional_Experience: updated })
  }

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      professional_Experience: [
        ...(prev.professional_Experience || []),
        {
          title: "",
          employementType: "",
          currentEmployer: "",
          organization: "",
          startDate: null,
          endDate: null,
          country: "",
          state: "",
          city: "",
          location: "",
          totalExpirnece: "",
          description: "",
          NoticePeriod: "",
          isFresher: false,
          isCurrentJob: false,
          salarysleep: [],
          appointmentletter: "",
          Relievingletter: "",
          experinceletter: "",
          Incrementletter: "",
        },
      ],
    }))
  }

  const deleteExperience = (index) => {
    const updated = [...formData.professional_Experience]
    updated.splice(index, 1)
    setFormData({ ...formData, professional_Experience: updated })
  }

  // Education handlers
  const handleEducationChange = (e, index) => {
    const { name, value } = e.target
    if (!formData.education) {
      setFormData((prev) => ({
        ...prev,
        education: [{ [name]: value }],
      }))
      return
    }

    const updated = [...formData.education]
    if (!updated[index]) {
      updated[index] = {}
    }
    updated[index][name] = value
    setFormData((prev) => ({ ...prev, education: updated }))
  }

  const addEducation = () => {
    const newEducation = {
      educationType: "",
      university: "",
      Institute: "",
      currentlyStudent: "false",
      startDate: null,
      endDate: null,
      numberOfYears: "",
      finalScore: "",
      country: "",
      state: "",
      city: "",
      yearOfPassing: "",
      description: "",
      masterdegree: "",
      graduationdegress: "",
      certificate: "",
    }

    setFormData((prev) => ({
      ...prev,
      education: prev.education ? [...prev.education, newEducation] : [newEducation],
    }))
  }

  const removeEducation = (index) => {
    if (!formData.education) return
    const updated = formData.education.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, education: updated }))
  }

  // Add this helper function after the existing helper functions
  const calculateAge = (birthDate) => {
    if (!birthDate) return ""
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age.toString()
  }

  // Nominee handlers
  const handleNomineeChange = (e, index) => {
    const { name, value } = e.target
    const updatedNominees = [...formData.nominee]

    // Ensure proper data types for specific fields
    let processedValue = value
    if (name === "nomineePhoneNumber" || name === "nomineePincode") {
      processedValue = String(value) // Ensure these are strings
    }

    updatedNominees[index][name] = processedValue

    // Auto-calculate age when DOB changes
    if (name === "dob") {
      updatedNominees[index].nominationAge = calculateAge(value)
    }

    setFormData((prev) => ({
      ...prev,
      nominee: updatedNominees,
    }))
  }

  const handleAddNominee = () => {
    const newNominee = {
      nomineeName: "",
      relationWithEmployee: "",
      nominationType: "",
      nominationAge: "",
      nomineeAddress: "",
      nomineeState: "",
      nomineeDistrict: "",
      nomineeblock: "",
      nomineePanchayat: "",
      nomineePincode: "",
      nomineePhoneNumber: "",
      dob: "",
      Aadhar_card: "",
    }
    setFormData((prevState) => ({
      ...prevState,
      nominee: [...prevState.nominee, newNominee],
    }))
  }

  const removeNominee = (index) => {
    const updated = formData.nominee.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, nominee: updated }))
  }

const addSkill = () => {
  if (newSkill.trim()) {
    setFormData((prev) => ({
      ...prev,
      SkillInfo: {
        ...prev.SkillInfo, // Preserve existing SkillInfo properties
        skills: [...(prev.SkillInfo?.skills || []), newSkill.trim()],
        languagesKnown: [...(prev.SkillInfo?.languagesKnown || [])],
      }
    }))
    setNewSkill("")
  }
}

const removeSkill = (index) => {
  setFormData((prev) => ({
    ...prev,
    SkillInfo: {
      ...prev.SkillInfo, // Preserve existing SkillInfo properties
      skills: (prev.SkillInfo?.skills || []).filter((_, i) => i !== index),
      languagesKnown: [...(prev.SkillInfo?.languagesKnown || [])],
    }
  }))
}

// Language handlers - FIXED
const addLanguage = () => {
  if (newLanguage.trim()) {
    setFormData((prev) => ({
      ...prev,
      SkillInfo: {
        ...prev.SkillInfo, // Preserve existing SkillInfo properties
        skills: [...(prev.SkillInfo?.skills || [])],
        languagesKnown: [...(prev.SkillInfo?.languagesKnown || []), newLanguage.trim()],
      }
    }))
    setNewLanguage("")
  }
}

const removeLanguage = (index) => {
  setFormData((prev) => ({
    ...prev,
    SkillInfo: {
      ...prev.SkillInfo, // Preserve existing SkillInfo properties
      skills: [...(prev.SkillInfo?.skills || [])],
      languagesKnown: (prev.SkillInfo?.languagesKnown || []).filter((_, i) => i !== index),
    }
  }))
}

  // Job Alert handlers
  const addJobAlert = () => {
    if (newJobAlert.trim()) {
      setFormData((prev) => ({
        ...prev,
        jobAlerts: [...(prev.jobAlerts || []), newJobAlert.trim()],
      }))
      setNewJobAlert("")
    }
  }

  const removeJobAlert = (index) => {
    setFormData((prev) => ({
      ...prev,
      jobAlerts: prev.jobAlerts.filter((_, i) => i !== index),
    }))
  }

  // Preferred Location handlers
  const addPreferredLocation = () => {
    if (newLocation.trim()) {
      setFormData((prev) => ({
        ...prev,
        jobPreferences: {
          ...prev.jobPreferences,
          preferredLocations: [...(prev.jobPreferences.preferredLocations || []), newLocation.trim()],
        },
      }))
      setNewLocation("")
    }
  }

  const removePreferredLocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      jobPreferences: {
        ...prev.jobPreferences,
        preferredLocations: prev.jobPreferences.preferredLocations.filter((_, i) => i !== index),
      },
    }))
  }

  // Social Account handlers
  const addSocialAccount = () => {
    if (newSocialAccount.trim()) {
      setFormData((prev) => ({
        ...prev,
        Basic_Info: {
          ...prev.Basic_Info,
          socialAccounts: [...(prev.Basic_Info.socialAccounts || []), newSocialAccount.trim()],
        },
      }))
      setNewSocialAccount("")
    }
  }

  const removeSocialAccount = (index) => {
    setFormData((prev) => ({
      ...prev,
      Basic_Info: {
        ...prev.Basic_Info,
        socialAccounts: prev.Basic_Info.socialAccounts.filter((_, i) => i !== index),
      },
    }))
  }

  // Document upload handler
  const handleDocumentUpload = async (e, documentType, experienceIndex = null, educationIndex = null) => {
    const file = e.target.files[0]
    if (!file) return

    const config = DOCUMENT_TYPES[documentType]
    const apiKey = config?.apiKey

    try {
      setLoading(true)
      const formDataObj = new FormData()
      formDataObj.append("file", file)

      e.target.value = null

      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formDataObj, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: token,
        },
        timeout: 60000, // 60 second timeout for file uploads
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        },
      })

      if (res.data.success) {
        setSnackbar({
          open: true,
          message: `${config?.label || "File"} uploaded successfully!`,
          severity: "success",
        })

        const uploadedUrl = res.data.url
        const updatedFormData = JSON.parse(JSON.stringify(formData))

        // Handle different document types based on API structure
        if (documentType === "resume") {
          updatedFormData.resume = uploadedUrl
        } else if (documentType === "certificate" && educationIndex !== null) {
          if (!updatedFormData.education[educationIndex]) {
            updatedFormData.education[educationIndex] = {}
          }
          updatedFormData.education[educationIndex].certificate = uploadedUrl
        } else if (
          ["appointmentletter", "Relievingletter", "experinceletter", "Incrementletter"].includes(documentType) &&
          experienceIndex !== null
        ) {
          if (!updatedFormData.professional_Experience[experienceIndex]) {
            updatedFormData.professional_Experience[experienceIndex] = {}
          }
          updatedFormData.professional_Experience[experienceIndex][documentType] = uploadedUrl
        } else if (documentType === "salarysleep" && experienceIndex !== null) {
          if (!updatedFormData.professional_Experience[experienceIndex]) {
            updatedFormData.professional_Experience[experienceIndex] = {}
          }
          if (!updatedFormData.professional_Experience[experienceIndex].salarysleep) {
            updatedFormData.professional_Experience[experienceIndex].salarysleep = []
          }
          updatedFormData.professional_Experience[experienceIndex].salarysleep.push(uploadedUrl)
        } else if (documentType === "BankStatment") {
          updatedFormData.Bank_verification.BankStatment = uploadedUrl
        } else if (["ElectricityBill", "RentAgreement", "BGV_Documents"].includes(documentType)) {
          if (!updatedFormData.Personal_Documents.Address_proof) {
            updatedFormData.Personal_Documents.Address_proof = [{}]
          }
          updatedFormData.Personal_Documents.Address_proof[0][documentType] = uploadedUrl
        } else if (documentType === "Others") {
          if (!updatedFormData.Personal_Documents.Others) {
            updatedFormData.Personal_Documents.Others = []
          }
          updatedFormData.Personal_Documents.Others.push(uploadedUrl)
        } else {
          updatedFormData.Personal_Documents[apiKey] = uploadedUrl
        }

        setFormData(updatedFormData)

        // Don't automatically call updateProfile here to avoid the network error
        // Let user manually save when they're ready
        const updatedPercent = calculateProfileCompletion(updatedFormData)
        setProgressPercentage(updatedPercent)
      } else {
        throw new Error(res.data.message || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)

      let errorMessage = "An error occurred while uploading the file."

      if (error.code === "ECONNABORTED") {
        errorMessage = "Upload timeout. Please try a smaller file."
      } else if (error.response?.status === 413) {
        errorMessage = "File too large. Please choose a smaller file."
      } else if (error.response?.status === 415) {
        errorMessage = "File type not supported. Please check the accepted formats."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Document removal handler
  const handleDocumentRemove = async (documentType, experienceIndex = null, educationIndex = null, urlIndex = null) => {
    try {
      const updatedFormData = JSON.parse(JSON.stringify(formData))

      // Handle different document types based on API structure
      if (documentType === "resume") {
        updatedFormData.resume = ""
      } else if (documentType === "certificate" && educationIndex !== null) {
        if (updatedFormData.education[educationIndex]) {
          updatedFormData.education[educationIndex].certificate = ""
        }
      } else if (
        ["appointmentletter", "Relievingletter", "experinceletter", "Incrementletter"].includes(documentType) &&
        experienceIndex !== null
      ) {
        if (updatedFormData.professional_Experience[experienceIndex]) {
          updatedFormData.professional_Experience[experienceIndex][documentType] = ""
        }
      } else if (documentType === "salarysleep" && experienceIndex !== null && urlIndex !== null) {
        if (updatedFormData.professional_Experience[experienceIndex]?.salarysleep) {
          updatedFormData.professional_Experience[experienceIndex].salarysleep.splice(urlIndex, 1)
        }
      } else if (documentType === "BankStatment") {
        updatedFormData.Bank_verification.BankStatment = ""
      } else if (["ElectricityBill", "RentAgreement", "BGV_Documents"].includes(documentType)) {
        if (updatedFormData.Personal_Documents.Address_proof?.[0]) {
          updatedFormData.Personal_Documents.Address_proof[0][documentType] = ""
        }
      } else if (documentType === "Others" && urlIndex !== null) {
        if (updatedFormData.Personal_Documents.Others) {
          updatedFormData.Personal_Documents.Others.splice(urlIndex, 1)
        }
      } else {
        const config = DOCUMENT_TYPES[documentType]
        if (config?.apiKey) {
          updatedFormData.Personal_Documents[config.apiKey] = ""
        }
      }

      setFormData(updatedFormData)

      setSnackbar({
        open: true,
        message: "Document removed successfully!",
        severity: "success",
      })

      // Update progress percentage
      const updatedPercent = calculateProfileCompletion(updatedFormData)
      setProgressPercentage(updatedPercent)
    } catch (error) {
      console.error("Remove document error:", error)
      setSnackbar({
        open: true,
        message: "Failed to remove document. Please try again.",
        severity: "error",
      })
    }
  }




  // Helper functions
  const getFileIcon = (url) => {
    if (!url) return <InsertDriveFile />
    const extension = url.split(".").pop().toLowerCase()
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return <ImageIcon />
    } else if (["pdf"].includes(extension)) {
      return <PictureAsPdf />
    } else {
      return <InsertDriveFile />
    }
  }

  const openDocument = (url) => {
    if (url) {
      window.open(url, "_blank")
    }
  }



  // Compact document card component
  const renderDocumentCard = (documentType, experienceIndex = null, educationIndex = null) => {
    const config = DOCUMENT_TYPES[documentType]
    let url = ""
    let urls = []

    // Get document URL based on type and API structure
    if (documentType === "resume") {
      url = formData.resume
    } else if (documentType === "BankStatment") {
      url = formData.Bank_verification?.BankStatment
    } else if (documentType === "certificate" && educationIndex !== null) {
      url = formData.education?.[educationIndex]?.certificate
    }
    //  else if (
    //   ["appointmentletter", "Relievingletter", "experinceletter", "Incrementletter"].includes(documentType) &&
    //   experienceIndex !== null
    // ) {
    //   url = formData.professional_Experience?.[experienceIndex]?.[documentType]
    // }
    // else if (documentType === "salarysleep" && experienceIndex !== null) {
    //   urls = formData.professional_Experience?.[experienceIndex]?.salarysleep || []
    // }
    else if (["ElectricityBill", "RentAgreement", "BGV_Documents"].includes(documentType)) {
      url = formData.Personal_Documents?.Address_proof?.[0]?.[documentType]
    } else if (documentType === "Others") {
      urls = formData.Personal_Documents?.Others || []
    } else {
      url = formData.Personal_Documents?.[config?.apiKey]
    }

    // For salary slip documents, show multiple upload capability
    if (documentType === "salarysleep" && experienceIndex !== null) {
      return (
        <Card sx={{ height: "auto", minHeight: "160px", border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <CardContent sx={{
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flexGrow: 1,
          }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: config.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: config.color,
                  mb: 1,
                  mx: "auto",
                }}
              >
                {config.icon}
              </Box>
              <Typography variant="caption" fontWeight={600} sx={{ fontSize: "0.75rem" }}>
                {config.label}
              </Typography>
            </Box>
            <Chip
              label={config.required ? "Required" : "Optional"}
              size="small"
              color={config.required ? "error" : "default"}
              variant="outlined"
              sx={{ mb: 1, fontSize: "0.7rem", height: "18px" }}
            />

            {urls.length > 0 && (
              <Box sx={{ mb: 2 }}>
                {urls.map((url, urlIndex) => (
                  <Box key={urlIndex} sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
                    <Chip
                      label={`Slip ${urlIndex + 1}`}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontSize: "0.7rem", flex: 1 }}
                      onClick={() => openDocument(url)}
                      clickable
                    />
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDocumentRemove(documentType, experienceIndex, educationIndex, urlIndex)}
                      sx={{ p: 0.25 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <Button
              variant="contained"
              component="label"
              size="small"
              startIcon={<CloudUpload />}
              disabled={loading}
              sx={{
                mt: 1,
                borderRadius: 1,
                textTransform: "none",
                fontSize: "0.7rem",
                py: 0.5,
                px: 1,

              }}
            >
              {urls.length > 0 ? "Add More" : "Upload"}
              <input
                type="file"
                hidden
                accept={config.acceptedFormats}
                onChange={(e) => handleDocumentUpload(e, documentType, experienceIndex, educationIndex)}
              />
            </Button>
          </CardContent>
        </Card>
      )
    }

    // Handle single documents
    return (
      <Card
        sx={{
          height: "160px",
          display: "flex",
          flexDirection: "column",
          border: url ? "1px solid #e0e0e0" : "2px dashed #ccc",
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bgcolor: config.bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: config.color,
              mb: 1,
            }}
          >
            {config.icon}
          </Box>

          <Typography variant="caption" fontWeight={600} gutterBottom sx={{ fontSize: "0.75rem" }}>
            {config.label}
          </Typography>

          <Chip
            label={config.required ? "Required" : "Optional"}
            size="small"
            color={config.required ? "error" : "default"}
            variant="outlined"
            sx={{ mb: 1, fontSize: "0.7rem", height: "18px" }}
          />

          {url ? (
            <>
              <Chip
                icon={<CheckCircle fontSize="small" />}
                label="Uploaded"
                size="small"
                color="success"
                variant="outlined"
                sx={{ mb: 1, fontSize: "0.7rem", height: "18px" }}
              />
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton size="small" onClick={() => openDocument(url)} sx={{ p: 0.25 }}>
                  <Visibility fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDocumentRemove(documentType, experienceIndex, educationIndex)}
                  sx={{ p: 0.25 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </>
          ) : (
            <Button
              variant="contained"
              component="label"
              size="small"
              startIcon={<CloudUpload />}
              disabled={loading}
              sx={{
                mt: 1,
                borderRadius: 1,
                textTransform: "none",
                fontSize: "0.7rem",
                py: 0.5,
                px: 1,

              }}
            >
              Upload
              <input
                type="file"
                hidden
                accept={config.acceptedFormats}
                onChange={(e) => handleDocumentUpload(e, documentType, experienceIndex, educationIndex)}
              />
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Function to check for missing required fields
  const getMissingRequiredFields = () => {
    const missing = []


    // Basic required fields
    if (!formData.userName) missing.push("Username")
    if (!formData.email) missing.push("Email")
    if (!formData.mobileNumber) missing.push("Mobile Number")
    if (!formData.Basic_Info?.Name) missing.push("Full Name")
    if (!formData.Basic_Info?.gender) missing.push("Gender")
    if (!formData.Basic_Info?.dob) missing.push("Date of Birth")
    // if (!formData.skills) missing.push("Skills")

    // Required documents
    // if (!formData.resume) missing.push("Resume")
    // if (!formData.Personal_Documents?.Aadhaar_front) missing.push("Aadhaar Front")
    // if (!formData.Personal_Documents?.Aadhar_Back) missing.push("Aadhaar Back")
    // if (!formData.Personal_Documents?.pancard) missing.push("PAN Card")
    // if (!formData.Personal_Documents?.passportsizephoto) missing.push("Passport Photo")

    // Address fields
    if (!formData.Basic_Info?.ResumeAddress) missing.push("ResumeAddress")
    // if (!formData.professional_Experience?.ResumeAddress) missing.push("Address")

    // if (!formData.Basic_Info?.CurrentAddress?.city) missing.push("City")
    // if (!formData.Basic_Info?.CurrentAddress?.state) missing.push("State")
    // if (!formData.Basic_Info?.CurrentAddress?.pincode) missing.push("Pincode")



    return missing
  }

  const renderTabContent = () => {
    if (initialLoading) {
      return (
        <Box sx={{ p: 4 }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )
    }

    // Get current tab key
    const currentTabKey = availableTabs[activeTab]?.key

    switch (currentTabKey) {
      case "basic_info": // Basic Details
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            <Card
              sx={{
                mb: 4,
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                background: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)"
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Grid container sx={{ minHeight: "200px" }}>
                  {/* Left Half - Profile Completion Status */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 4,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        borderRight: { md: "1px solid" },
                        borderRightColor: { md: "divider" },
                        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%)"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2
                          }}
                        >
                          <Typography variant="h6" color="white" fontWeight={700}>
                            %
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ color: "text.primary" }}
                        >
                          Profile Completion
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            Progress
                          </Typography>
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                              color: progressPercentage < 50 ? "error.main" :
                                progressPercentage < 80 ? "warning.main" : "success.main"
                            }}
                          >
                            {progressPercentage}%
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "grey.200",
                            position: "relative",
                            overflow: "hidden",
                            mb: 2
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              height: "100%",
                              width: `${progressPercentage}%`,
                              borderRadius: 4,
                              background: progressPercentage < 50
                                ? "linear-gradient(90deg, #f44336 0%, #ff6b6b 100%)"
                                : progressPercentage < 80
                                  ? "linear-gradient(90deg, #ff9800 0%, #ffb74d 100%)"
                                  : "linear-gradient(90deg, #4caf50 0%, #81c784 100%)",
                              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            fontWeight: 400
                          }}
                        >
                          {progressPercentage < 50
                            ? "🚀 Let's complete your profile to unlock more opportunities!"
                            : progressPercentage < 80
                              ? "⭐ Great progress! Add more details to stand out."
                              : "🎉 Excellent! Your profile is comprehensive and attractive."}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Right Half - Resume Section */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 4,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: "error.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2
                          }}
                        >
                          <Typography variant="h6" color="white" fontWeight={700}>
                            📄
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ color: "text.primary" }}
                        >
                          Resume
                        </Typography>
                      </Box>

                      <Box

                      >
                        {
                          renderDocumentCard("resume")

                        }
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Basic Personal Details */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Basic Details
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.Basic_Info?.Name || ""}
                  onChange={(e) => handleChange({ target: { name: "Name", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange({ target: { name: "email", value: e.target.value } })}
                  variant="outlined"
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={formData.mobileNumber || ""}
                  onChange={(e) => handleChange({ target: { name: "mobileNumber", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formatDate(formData.Basic_Info?.dob)}
                  onChange={(e) => handleChange({ target: { name: "dob", value: e.target.value } })}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </Grid>

            </Grid>


            {/* Profile Summary */}
            <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                  Profile Summary
                </Typography>
                <TextField
                  fullWidth
                  label="Professional Summary"
                  value={formData.summary || ""}
                  onChange={(e) => handleChange({ target: { name: "summary", value: e.target.value } })}
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Write a brief professional summary highlighting your experience, skills, and career goals..."
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  A good summary helps employers quickly understand your qualifications and career objectives.
                </Typography>
              </CardContent>
            </Card>



            {/* Social Accounts */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Social Accounts
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  {formData.Basic_Info?.socialAccounts?.map((account, index) => (
                    <Chip
                      key={index}
                      label={account}
                      onDelete={() => removeSocialAccount(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    label="Add Social Account URL"
                    value={newSocialAccount}
                    onChange={(e) => setNewSocialAccount(e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <Button variant="outlined" onClick={addSocialAccount} sx={{ minWidth: "100px" }}>
                    Add
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Current Address */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Address
            </Typography>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.Basic_Info?.ResumeAddress || ""}
                onChange={(e) => handleChange({ target: { name: "ResumeAddress", value: e.target.value } })}
                variant="outlined"
              />
            </Grid>
            {/* <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.Basic_Info?.CurrentAddress?.address1 || ""}
                  onChange={(e) => handleAddressChange("CurrentAddress", "address1", e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={formData.Basic_Info?.CurrentAddress?.address2 || ""}
                  onChange={(e) => handleAddressChange("CurrentAddress", "address2", e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.Basic_Info?.CurrentAddress?.city || ""}
                  onChange={(e) => handleAddressChange("CurrentAddress", "city", e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.Basic_Info?.CurrentAddress?.state || ""}
                  onChange={(e) => handleAddressChange("CurrentAddress", "state", e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={formData.Basic_Info?.CurrentAddress?.pincode || ""}
                  onChange={(e) => handleAddressChange("CurrentAddress", "pincode", e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.Basic_Info?.CurrentAddress?.country || ""}
                  onChange={(e) => handleAddressChange("CurrentAddress", "country", e.target.value)}
                  variant="outlined"
                />
              </Grid>
            </Grid> */}

            {/* Permanent Address */}
            {/* <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Permanent Address
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sameAsCurrentAddress}
                  onChange={(e) => handleSameAsCurrentAddress(e.target.checked)}
                />
              }
              label="Same as Current Address"
              sx={{ mb: 2 }}
            /> */}
            {/* <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.Basic_Info?.PermentAddress?.address1 || ""}
                  onChange={(e) => handleAddressChange("PermentAddress", "address1", e.target.value)}
                  variant="outlined"
                  disabled={sameAsCurrentAddress}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={formData.Basic_Info?.PermentAddress?.address2 || ""}
                  onChange={(e) => handleAddressChange("PermentAddress", "address2", e.target.value)}
                  variant="outlined"
                  disabled={sameAsCurrentAddress}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.Basic_Info?.PermentAddress?.city || ""}
                  onChange={(e) => handleAddressChange("PermentAddress", "city", e.target.value)}
                  variant="outlined"
                  disabled={sameAsCurrentAddress}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.Basic_Info?.PermentAddress?.state || ""}
                  onChange={(e) => handleAddressChange("PermentAddress", "state", e.target.value)}
                  variant="outlined"
                  disabled={sameAsCurrentAddress}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={formData.Basic_Info?.PermentAddress?.pincode || ""}
                  onChange={(e) => handleAddressChange("PermentAddress", "pincode", e.target.value)}
                  variant="outlined"
                  disabled={sameAsCurrentAddress}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.Basic_Info?.PermentAddress?.country || ""}
                  onChange={(e) => handleAddressChange("PermentAddress", "country", e.target.value)}
                  variant="outlined"
                  disabled={sameAsCurrentAddress}
                />
              </Grid>
            </Grid> */}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save Basic Details"}
              </Button>
            </Box>
          </Box>
        )

      case "professional_experience": // Experience
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              Professional Experience
            </Typography>

            <Grid item xs={12} md={6} sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isFresher || false}
                    onChange={(e) => {
                      setFormData({ ...formData, isFresher: e.target.checked })
                    }}
                  />
                }
                disabled={formData.professional_Experience}
                label="Is Fresher"
              />
            </Grid>
            {formData.professional_Experience?.map((exp, index) => (
              <Card key={index} sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Experience {index + 1}
                    </Typography>
                    <Button variant="outlined" color="error" size="small" onClick={() => deleteExperience(index)}>
                      Remove
                    </Button>
                  </Box>

                  {/* Job Information */}
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Job Information
                  </Typography>


                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        value={exp.title || ""}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="title"
                        variant="outlined"
                      />
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Employment Type</InputLabel>
                        <Select
                          value={exp.employementType || ""}
                          onChange={(e) => handleExperienceChange(e, index)}
                          name="employementType"
                          label="Employment Type"
                        >
                          {DROPDOWN_OPTIONS.employmentType.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid> */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Organization"
                        value={exp.organization || ""}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="organization"
                        variant="outlined"
                      />
                    </Grid>
                    {/* <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Current Employer</InputLabel>
                        <Select
                          value={exp.currentEmployer || ""}
                          onChange={(e) => handleExperienceChange(e, index)}
                          name="currentEmployer"
                          label="Current Employer"
                        >
                          {DROPDOWN_OPTIONS.currentEmployer.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Total Experience"
                        value={exp.totalExpirnece || ""}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="totalExpirnece"
                        variant="outlined"
                      />
                    </Grid>
                    {exp.currentEmployer == 'Yes' ?
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Notice Period (Days)"
                          value={exp.NoticePeriod || ""}
                          onChange={(e) => handleExperienceChange(e, index)}
                          name="NoticePeriod"
                          variant="outlined"
                        />
                      </Grid> : null
                    } */}

                  </Grid>

                  {/* Duration & Status */}
                  {/* <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Duration & Status
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={formatDate(exp.startDate)}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="startDate"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={formatDate(exp.endDate)}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="endDate"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        disabled={exp.currentEmployer == 'Yes'}
                      />
                    </Grid>


                  </Grid> */}

                  {/* Location Details */}
                  {/* <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Location Details
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={exp.country || ""}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="country"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="State"
                        value={exp.state || ""}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="state"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="City"
                        value={exp.city || ""}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="city"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Location"
                        value={exp.location || ""}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="location"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid> */}

                  {/* Job Description */}
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Roles And Responsibilities
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Roles And Responsibilities"
                        value={exp.description || ""}
                        onChange={(e) => handleExperienceChange(e, index)}
                        name="description"
                        multiline
                        rows={4}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  {/* Experience Documents
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Experience Documents
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={3}>
                      {renderDocumentCard("salarysleep", index)}
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                      {renderDocumentCard("appointmentletter", index)}
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                      {renderDocumentCard("Relievingletter", index)}
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                      {renderDocumentCard("experinceletter", index)}
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                      {renderDocumentCard("Incrementletter", index)}
                    </Grid>
                  </Grid> */}
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addExperience}
              disabled={formData.isFresher}
              sx={{ mb: 3, borderRadius: 2, textTransform: "none", borderStyle: "dashed", py: 2, width: "100%" }}
            >
              Add Experience
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save Experience"}
              </Button>
            </Box>
          </Box>
        )

      case "education": // Education
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              Education
            </Typography>
            {formData.education?.map((edu, index) => (
              <Card key={index} sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Education {index + 1}
                    </Typography>
                    <Button variant="outlined" color="error" size="small" onClick={() => removeEducation(index)}>
                      Remove
                    </Button>
                  </Box>

                  {/* Education Details */}
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Education Details
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Education Type</InputLabel>
                        <Select
                          value={edu.educationType || ""}
                          onChange={(e) => handleEducationChange(e, index)}
                          name="educationType"
                          label="Education Type"
                        >
                          {DROPDOWN_OPTIONS.educationType.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Currently Student</InputLabel>
                        <Select
                          value={edu.currentlyStudent || "false"}
                          onChange={(e) => handleEducationChange(e, index)}
                          name="currentlyStudent"
                          label="Currently Student"
                        >
                          {DROPDOWN_OPTIONS.currentlyStudent.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option === "true" ? "Yes" : "No"}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid> */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="University"
                        value={edu.university || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="university"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Institute"
                        value={edu.Institute || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="Institute"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Graduation Degree"
                        value={edu.graduationdegress || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="graduationdegress"
                        variant="outlined"
                      />
                    </Grid>
                    {/* <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description"
                        value={edu.description || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="description"
                        multiline
                        rows={3}
                        variant="outlined"
                      />
                    </Grid> */}
                  </Grid>

                  {/* Duration & Academic Details */}
                  {/* <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Duration & Academic Performance
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={formatDate(edu.startDate)}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="startDate"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={formatDate(edu.endDate)}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="endDate"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        disabled={edu.currentlyStudent === "true"}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Year of Passing"
                        value={edu.yearOfPassing || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="yearOfPassing"
                        variant="outlined"
                        placeholder="eg : In Years"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Number of Years"
                        value={edu.numberOfYears || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="numberOfYears"
                        variant="outlined"
                        placeholder="eg : In Years"
                        type = "number"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Final Score/Grade"
                        value={edu.finalScore || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="finalScore"
                        variant="outlined"
                        // placeholder="eg : In Years"
                        type="number"
                      />
                    </Grid>
                  </Grid> */}

                  {/* Location Details */}
                  {/* <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Location Details
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={edu.country || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="country"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="State"
                        value={edu.state || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="state"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="City"
                        value={edu.city || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="city"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid> */}

                  {/* Degree Details */}
                  {/* <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Degree Specialization
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Master Degree"
                        value={edu.masterdegree || ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        name="masterdegree"
                        variant="outlined"
                      />
                    </Grid>

                  </Grid> */}

                  {/* Education Certificate */}
                  {/* <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Education Certificate
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4} md={3}>
                      {renderDocumentCard("certificate", null, index)}
                    </Grid>
                  </Grid> */}
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addEducation}
              sx={{ mb: 3, borderRadius: 2, textTransform: "none", borderStyle: "dashed", py: 2, width: "100%" }}
            >
              Add Education
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save Education"}
              </Button>
            </Box>
          </Box>
        )

      case "family_info": // Family Info & Nominees
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              Family Information & Nominees
            </Typography>

            {/* Family Information */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Family Information
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Father's Name"
                  value={formData.Family_Info?.fatherName || ""}
                  onChange={(e) => handleChange({ target: { name: "fatherName", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mother's Name"
                  value={formData.Family_Info?.motherName || ""}
                  onChange={(e) => handleChange({ target: { name: "motherName", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Father's Occupation"
                  value={formData.Family_Info?.fathersOccupation || ""}
                  onChange={(e) => handleChange({ target: { name: "fathersOccupation", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Father's Mobile Number"
                  value={formData.Family_Info?.fathersMobileNo || ""}
                  onChange={(e) => handleChange({ target: { name: "fathersMobileNo", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mother's Mobile Number"
                  value={formData.Family_Info?.mothersMobileNo || ""}
                  onChange={(e) => handleChange({ target: { name: "mothersMobileNo", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Family Income"
                  value={formData.Family_Info?.familyIncome || ""}
                  onChange={(e) => handleChange({ target: { name: "familyIncome", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Family Members"
                  value={formData.Family_Info?.familymember || ""}
                  onChange={(e) => handleChange({ target: { name: "familymember", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Nominee Section */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Nominee Information
            </Typography>

            {formData.nominee?.map((nominee, index) => (
              <Card key={index} sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Nominee {index + 1}
                    </Typography>
                    <Button variant="outlined" color="error" size="small" onClick={() => removeNominee(index)}>
                      Remove
                    </Button>
                  </Box>

                  {/* Basic Nominee Details */}
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Basic Details
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nominee Name"
                        value={nominee.nomineeName || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="nomineeName"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Relation with Employee</InputLabel>
                        <Select
                          value={nominee.relationWithEmployee || ""}
                          onChange={(e) => handleNomineeChange(e, index)}
                          name="relationWithEmployee"
                          label="Relation with Employee"
                        >
                          {DROPDOWN_OPTIONS.relation.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nominee Age"
                        value={calculateAge(nominee.dob)}
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                        helperText="Auto-calculated from Date of Birth"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        type="date"
                        value={nominee.dob || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="dob"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nominee Phone Number"
                        value={nominee.nomineePhoneNumber || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="nomineePhoneNumber"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Aadhaar Card Number"
                        value={nominee.Aadhar_card || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="Aadhar_card"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>

                  {/* Address Details */}
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                    Address Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Nominee Address"
                        value={nominee.nomineeAddress || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="nomineeAddress"
                        multiline
                        rows={2}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="State"
                        value={nominee.nomineeState || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="nomineeState"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="District"
                        value={nominee.nomineeDistrict || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="nomineeDistrict"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Pincode"
                        value={nominee.nomineePincode || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="nomineePincode"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Block"
                        value={nominee.nomineeblock || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="nomineeblock"
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Panchayat"
                        value={nominee.nomineePanchayat || ""}
                        onChange={(e) => handleNomineeChange(e, index)}
                        name="nomineePanchayat"
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddNominee}
              sx={{ mb: 3, borderRadius: 2, textTransform: "none", borderStyle: "dashed", py: 2, width: "100%" }}
            >
              Add Nominee
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save Family Info"}
              </Button>
            </Box>
          </Box>
        )

      case "Bank_verification": // Bank Details
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              Bank Verification
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={formData.Bank_verification?.account_number || ""}
                  onChange={(e) => handleChange({ target: { name: "account_number", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  value={formData.Bank_verification?.ifsc || ""}
                  onChange={(e) => handleChange({ target: { name: "ifsc", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={formData.Bank_verification?.bank_name || ""}
                  onChange={(e) => handleChange({ target: { name: "bank_name", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Holder Name"
                  value={formData.Bank_verification?.name || ""}
                  onChange={(e) => handleChange({ target: { name: "name", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.Bank_verification?.city || ""}
                  onChange={(e) => handleChange({ target: { name: "city", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Branch"
                  value={formData.Bank_verification?.branch || ""}
                  onChange={(e) => handleChange({ target: { name: "branch", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UAN Number"
                  value={formData.Bank_verification?.uan || ""}
                  onChange={(e) => handleChange({ target: { name: "uan", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ESIC Number"
                  value={formData.Bank_verification?.EsicNumber || ""}
                  onChange={(e) => handleChange({ target: { name: "EsicNumber", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Cover Under PF</InputLabel>
                  <Select
                    value={formData.Bank_verification?.converUnderpf || "false"}
                    onChange={(e) => handleChange({ target: { name: "converUnderpf", value: e.target.value } })}
                    label="Cover Under PF"
                  >
                    {DROPDOWN_OPTIONS.converUnderpf.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option === "true" ? "Yes" : "No"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Bank Statement Upload */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Bank Statement
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("BankStatment")}
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save Bank Details"}
              </Button>
            </Box>
          </Box>
        )

      case "KYC_Details": // KYC Details
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              KYC Details
            </Typography>

            {/* Aadhaar Card */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                  Aadhaar Card Details
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Aadhaar Card Number"
                      value={formData.KYC_Details?.aadharcardNo || ""}
                      onChange={(e) => handleChange({ target: { name: "aadharcardNo", value: e.target.value } })}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                        startIcon={<CloudUpload />}
                        disabled={loading}
                        sx={{ textTransform: "none" }}
                      >
                        Upload Front
                        <input
                          type="file"
                          hidden
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleDocumentUpload(e, "Aadhaar_front")}
                        />
                      </Button>
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                        startIcon={<CloudUpload />}
                        disabled={loading}
                        sx={{ textTransform: "none" }}
                      >
                        Upload Back
                        <input
                          type="file"
                          hidden
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleDocumentUpload(e, "Aadhar_Back")}
                        />
                      </Button>
                      {formData.Personal_Documents?.Aadhaar_front && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => openDocument(formData.Personal_Documents.Aadhaar_front)}
                          sx={{ textTransform: "none" }}
                        >
                          View Front
                        </Button>
                      )}
                      {formData.Personal_Documents?.Aadhar_Back && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => openDocument(formData.Personal_Documents.Aadhar_Back)}
                          sx={{ textTransform: "none" }}
                        >
                          View Back
                        </Button>
                      )}
                      {formData.Personal_Documents?.Aadhaar_front && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDocumentRemove("Aadhaar_front")}
                          sx={{ textTransform: "none" }}
                        >
                          Remove Front
                        </Button>
                      )}
                      {formData.Personal_Documents?.Aadhar_Back && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDocumentRemove("Aadhar_Back")}
                          sx={{ textTransform: "none" }}
                        >
                          Remove Back
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* PAN Card */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                  PAN Card Details
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="PAN Card Number"
                      value={formData.KYC_Details?.pancardNo || ""}
                      onChange={(e) => handleChange({ target: { name: "pancardNo", value: e.target.value } })}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                        startIcon={<CloudUpload />}
                        disabled={loading}
                        sx={{ textTransform: "none" }}
                      >
                        Upload PAN
                        <input
                          type="file"
                          hidden
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleDocumentUpload(e, "pancard")}
                        />
                      </Button>
                      {formData.Personal_Documents?.pancard && (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => openDocument(formData.Personal_Documents.pancard)}
                            sx={{ textTransform: "none" }}
                          >
                            View PAN
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDocumentRemove("pancard")}
                            sx={{ textTransform: "none" }}
                          >
                            Remove PAN
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Voter ID */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                  Voter ID Details
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Voter ID Number"
                      value={formData.KYC_Details?.VoterId || ""}
                      onChange={(e) => handleChange({ target: { name: "VoterId", value: e.target.value } })}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                        startIcon={<CloudUpload />}
                        disabled={loading}
                        sx={{ textTransform: "none" }}
                      >
                        Upload Voter ID
                        <input
                          type="file"
                          hidden
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleDocumentUpload(e, "voterId")}
                        />
                      </Button>
                      {formData.Personal_Documents?.voterId && (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => openDocument(formData.Personal_Documents.voterId)}
                            sx={{ textTransform: "none" }}
                          >
                            View Voter ID
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDocumentRemove("voterId")}
                            sx={{ textTransform: "none" }}
                          >
                            Remove Voter ID
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Driving License */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                  Driving License Details
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Driving License Number"
                      value={formData.KYC_Details?.drivingLicenseNo || ""}
                      onChange={(e) => handleChange({ target: { name: "drivingLicenseNo", value: e.target.value } })}
                      variant="outlined"
                      placeholder="Optional"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="contained"
                        component="label"
                        size="small"
                        startIcon={<CloudUpload />}
                        disabled={loading}
                        sx={{ textTransform: "none" }}
                      >
                        Upload DL
                        <input
                          type="file"
                          hidden
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleDocumentUpload(e, "DrivingLicence")}
                        />
                      </Button>
                      {formData.Personal_Documents?.DrivingLicence && (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => openDocument(formData.Personal_Documents.DrivingLicence)}
                            sx={{ textTransform: "none" }}
                          >
                            View DL
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDocumentRemove("DrivingLicence")}
                            sx={{ textTransform: "none" }}
                          >
                            Remove DL
                          </Button>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Passport */}
            <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 1 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                  Passport Details
                </Typography>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Passport Number"
                      value={formData.KYC_Details?.passportNo || ""}
                      onChange={(e) => handleChange({ target: { name: "passportNo", value: e.target.value } })}
                      variant="outlined"
                      placeholder="Optional"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="UAN Number"
                      value={formData.KYC_Details?.uanNumber || ""}
                      onChange={(e) => handleChange({ target: { name: "uanNumber", value: e.target.value } })}
                      variant="outlined"
                      placeholder="Optional"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save KYC Details"}
              </Button>
            </Box>
          </Box>
        )

      case "Personal_Documents": // Documents
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              Document Upload
            </Typography>

            {/* Resume Upload */}


            {/* Required Documents */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "error.main" }}>
              Required Identity Documents
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("Aadhaar_front")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("Aadhar_Back")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("pancard")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("passportsizephoto")}
              </Grid>
            </Grid>

            {/* Experience Documents */}
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Experience Documents
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("salarysleep")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("appointmentletter")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("Relievingletter")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("experinceletter")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("Incrementletter")}
              </Grid>
            </Grid>

            {/* Optional Identity Documents */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Optional Identity Documents
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("voterId")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("DrivingLicence")}
              </Grid>
            </Grid>

            {/* Address Proof Documents */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Address Proof Documents
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("ElectricityBill")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("RentAgreement")}
              </Grid>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("BGV_Documents")}
              </Grid>
            </Grid>

            {/* Other Documents */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Other Documents
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={3}>
                {renderDocumentCard("Others")}
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save Documents"}
              </Button>
            </Box>
          </Box>
        )

      case "SkillInfo": // Skills Tab
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              Skills & Qualifications
            </Typography>

            {/* Technical Skills */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3, color: "primary.main" }}>
            Technical Skills
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {(formData.SkillInfo?.skills || []).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  onDelete={() => removeSkill(index)}
                  color="primary"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 500,
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                    }
                  }}
                />
              ))}
              {(!formData.SkillInfo?.skills || formData.SkillInfo.skills.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  No skills added yet. Add your technical skills below.
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                label="Add Technical Skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="e.g. JavaScript, React, Python, AWS"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={addSkill}
                sx={{ minWidth: "100px" }}
                disabled={!newSkill.trim()}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add all relevant technical skills that showcase your expertise. These skills will be highlighted to potential employers.
          </Typography>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3, color: "primary.main" }}>
            Languages Known
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {(formData.SkillInfo?.languagesKnown || []).map((language, index) => (
                <Chip
                  key={index}
                  label={language}
                  onDelete={() => removeLanguage(index)}
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: 1.5 }}
                />
              ))}
              {(!formData.SkillInfo?.languagesKnown || formData.SkillInfo.languagesKnown.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  No languages added yet. Add languages you know below.
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                label="Add Language"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="e.g. English, Hindi, Spanish"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addLanguage();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={addLanguage}
                sx={{ minWidth: "100px" }}
                disabled={!newLanguage.trim()}
              >
                Add
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

            {/* Job Preferences */}
            {/* <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3, color: "primary.main" }}>
                  Job Preferences
                </Typography>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Preferred Job Type</InputLabel>
                      <Select
                        value={formData.jobPreferences?.jobType || ""}
                        onChange={(e) => handleJobPreferenceChange("jobType", e.target.value)}
                        label="Preferred Job Type"
                      >
                        {DROPDOWN_OPTIONS.jobType.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Notice Period (Days)"
                      type="number"
                      value={formData.jobPreferences?.noticePeriodInDays || ""}
                      onChange={(e) => handleJobPreferenceChange("noticePeriodInDays", e.target.value)}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Current CTC"
                      value={formData.currentCTC || ""}
                      onChange={(e) => handleChange({ target: { name: "currentCTC", value: e.target.value } })}
                      variant="outlined"
                      placeholder="e.g. 60000"
                      type = "number"
                    />
                  </Grid>
                      <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Expected CTC"
                      value={formData.expectedSalary || ""}
                      onChange={(e) => handleChange({ target: { name: "expectedSalary", value: e.target.value } })}
                      variant="outlined"
                      placeholder="e.g. 75000"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Reason for Leaving Current Job"
                      value={formData.Reasonforleaving || ""}
                      onChange={(e) => handleChange({ target: { name: "Reasonforleaving", value: e.target.value } })}
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                  Preferred Locations
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {formData.jobPreferences?.preferredLocations?.map((location, index) => (
                      <Chip
                        key={index}
                        label={location}
                        onDelete={() => removePreferredLocation(index)}
                        variant="outlined"
                        color="primary"
                        sx={{ borderRadius: 1.5 }}
                      />
                    ))}
                    {!formData.jobPreferences?.preferredLocations?.length && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        No preferred locations added yet.
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Add Preferred Location"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      variant="outlined"
                      size="small"
                      placeholder="e.g. Bangalore, Remote"
                    />
                    <Button
                      variant="outlined"
                      onClick={addPreferredLocation}
                      sx={{ minWidth: "100px" }}
                    // disabled={!newLocation.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card> */}

            {/* Job Alerts */}
            {/* <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3, color: "primary.main" }}>
                  Job Alerts
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                    {formData.jobAlerts?.map((alert, index) => (
                      <Chip
                        key={index}
                        label={alert}
                        onDelete={() => removeJobAlert(index)}
                        variant="outlined"
                        color="primary"
                        sx={{ borderRadius: 1.5 }}
                      />
                    ))}
                    {formData.jobAlerts?.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        No job alerts added yet. Add keywords for job alerts below.
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Add Job Alert Keyword"
                      value={newJobAlert}
                      onChange={(e) => setNewJobAlert(e.target.value)}
                      variant="outlined"
                      size="small"
                      placeholder="e.g. Frontend Developer, Data Scientist"
                    />
                    <Button
                      variant="outlined"
                      onClick={addJobAlert}
                      sx={{ minWidth: "100px" }}
                    // disabled={!newJobAlert.trim()}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Add keywords for job roles you're interested in. You'll receive alerts when matching positions are available.
                </Typography>
              </CardContent>
            </Card> */}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save Skills & Preferences"}
              </Button>
            </Box>
          </Box>
        )

      case "OtherInformation": // Other Information Tab
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
              Other Information
            </Typography>

            {/* Profile Completion Status */}



            {/* Emergency Contact */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Emergency Contact
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Name"
                  value={formData.Basic_Info?.EmergencyContact || ""}
                  onChange={(e) => handleChange({ target: { name: "EmergencyContact", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Emergency Contact Number"
                  value={formData.Basic_Info?.EmergencyNumber || ""}
                  onChange={(e) => handleChange({ target: { name: "EmergencyNumber", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Relation with Contact</InputLabel>
                  <Select
                    value={formData.Basic_Info?.RelationwihContact || ""}
                    onChange={(e) => handleChange({ target: { name: "RelationwihContact", value: e.target.value } })}
                    label="Relation with Contact"
                  >
                    {DROPDOWN_OPTIONS.relation.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Physical & Other Details */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
              Physical & Other Details
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={formData.Basic_Info?.gender || ""}
                    onChange={(e) => handleChange({ target: { name: "gender", value: e.target.value } })}
                    label="Gender"
                  >
                    {DROPDOWN_OPTIONS.gender.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Marital Status</InputLabel>
                  <Select
                    value={formData.Basic_Info?.maritalStatus || ""}
                    onChange={(e) => handleChange({ target: { name: "maritalStatus", value: e.target.value } })}
                    label="Marital Status"
                  >
                    {DROPDOWN_OPTIONS.maritalStatus.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Nationality</InputLabel>
                  <Select
                    value={formData.Basic_Info?.Nationality || ""}
                    onChange={(e) => handleChange({ target: { name: "Nationality", value: e.target.value } })}
                    label="Nationality"
                  >
                    {DROPDOWN_OPTIONS.nationality.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Height"
                  value={formData.Basic_Info?.height || ""}
                  onChange={(e) => handleChange({ target: { name: "height", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    value={formData.Basic_Info?.bloodGroup || ""}
                    onChange={(e) => handleChange({ target: { name: "bloodGroup", value: e.target.value } })}
                    label="Blood Group"
                  >
                    {DROPDOWN_OPTIONS.bloodGroup.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Religion</InputLabel>
                  <Select
                    value={formData.Basic_Info?.religion || ""}
                    onChange={(e) => handleChange({ target: { name: "religion", value: e.target.value } })}
                    label="Religion"
                  >
                    {DROPDOWN_OPTIONS.religion.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.Basic_Info?.category || ""}
                    onChange={(e) => handleChange({ target: { name: "category", value: e.target.value } })}
                    label="Category"
                  >
                    {DROPDOWN_OPTIONS.category.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Caste"
                  value={formData.Basic_Info?.caste || ""}
                  onChange={(e) => handleChange({ target: { name: "caste", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Identity Mark"
                  value={formData.Basic_Info?.identityMark || ""}
                  onChange={(e) => handleChange({ target: { name: "identityMark", value: e.target.value } })}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* Missing Required Fields */}
            {/* <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                  Missing Required Information
                </Typography>
                <Box>
                  {getMissingRequiredFields().length > 0 ? (
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        The following required fields are missing from your profile:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {getMissingRequiredFields().map((field, index) => (
                          <Chip
                            key={index}
                            label={field}
                            color="error"
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                      All required fields have been completed. Great job!
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card> */}

            {/* About Section */}
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: "primary.main" }}>
                  About Yourself
                </Typography>
                <TextField
                  fullWidth
                  label="About Yourself"
                  value={formData.aboutUs || ""}
                  onChange={(e) => handleChange({ target: { name: "aboutUs", value: e.target.value } })}
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Share more about yourself, your interests, hobbies, or anything else you'd like employers to know..."
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  This section helps employers get to know you beyond your professional qualifications.
                </Typography>
              </CardContent>
            </Card>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ borderRadius: 2, textTransform: "none", px: 4, py: 1.5, fontWeight: 600 }}
              >
                {loading ? "Saving..." : "Save Information"}
              </Button>
            </Box>
          </Box>
        )

      default:
        return (
          <Box sx={{ p: 4 }}>
            <Typography variant="h6">Tab content not implemented yet</Typography>
          </Box>
        )
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Create a clean copy of formData without internal React state or circular references
      const cleanFormData = JSON.parse(JSON.stringify(formData))



      // Remove any fields that shouldn't be sent to the API
      delete cleanFormData._id
      delete cleanFormData.__v
      delete cleanFormData.createdAt
      delete cleanFormData.updatedAt

      // Helper function to safely convert dates
      const safeISODate = (date) => {
        if (!date) return null

        let dateObj
        if (date instanceof Date) {
          dateObj = date
        } else if (typeof date === "string" || typeof date === "number") {
          dateObj = new Date(date)
        } else {
          return null
        }

        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
          return null
        }

        return dateObj.toISOString()
      }

      // Prepare the request body with proper data types and required fields
      const requestBody = {
        // Top-level required fields
        userName: cleanFormData.userName || "",
        email: cleanFormData.email || "",
        mobileNumber: cleanFormData.mobileNumber || "",

        // Other top-level fields
        coverPhoto: cleanFormData.coverPhoto || "",
        profilePicture: cleanFormData.profilePicture || "",
        resume: cleanFormData.resume || "",
        summary: cleanFormData.summary || "",
        aboutUs: cleanFormData.aboutUs || "",
        expectedSalary: cleanFormData.expectedSalary ? String(cleanFormData.expectedSalary) : "",
        currentCTC: cleanFormData.currentCTC ? String(cleanFormData.currentCTC) : "",
        Reasonforleaving: cleanFormData.Reasonforleaving || "",
        Resume_Analizer: cleanFormData.Resume_Analizer || "",

        // Nested objects with proper null checks
        resumeDetails: {
          originalFileName: cleanFormData.resumeDetails?.originalFileName || "",
          uploadedAt: cleanFormData.resumeDetails?.uploadedAt || null,
          parsedKeywords: Array.isArray(cleanFormData.resumeDetails?.parsedKeywords)
            ? cleanFormData.resumeDetails.parsedKeywords
            : [],
        },

        Basic_Info: {
          ResumeAddress: cleanFormData.Basic_Info?.ResumeAddress || '',
          Name: cleanFormData.Basic_Info?.Name || "",
          email: cleanFormData.Basic_Info?.email || cleanFormData.email || "",
          gender: cleanFormData.Basic_Info?.gender || "",
          dob: cleanFormData.Basic_Info?.dob ? safeISODate(cleanFormData.Basic_Info.dob) : null,
          fatherName: cleanFormData.Basic_Info?.fatherName || "",
          MotherName: cleanFormData.Basic_Info?.MotherName || "",
          maritalStatus: cleanFormData.Basic_Info?.maritalStatus || "",
          EmergencyNumber: cleanFormData.Basic_Info?.EmergencyNumber || "",
          EmergencyContact: cleanFormData.Basic_Info?.EmergencyContact || "",
          RelationwihContact: cleanFormData.Basic_Info?.RelationwihContact || "",
          Nationality: cleanFormData.Basic_Info?.Nationality || "",
          identityMark: cleanFormData.Basic_Info?.identityMark || "",
          height: cleanFormData.Basic_Info?.height || "",
          caste: cleanFormData.Basic_Info?.caste || "",
          landmark: cleanFormData.Basic_Info?.landmark || "",
          category: cleanFormData.Basic_Info?.category || "",
          religion: cleanFormData.Basic_Info?.religion || "",
          bloodGroup: cleanFormData.Basic_Info?.bloodGroup || "",
          homeDistrict: cleanFormData.Basic_Info?.homeDistrict || "",
          homeState: cleanFormData.Basic_Info?.homeState || "",
          nearestRailwaySt: cleanFormData.Basic_Info?.nearestRailwaySt || "",
          Reference: cleanFormData.Basic_Info?.Reference || "",
          socialAccounts: Array.isArray(cleanFormData.Basic_Info?.socialAccounts)
            ? cleanFormData.Basic_Info.socialAccounts
            : [],
          CurrentAddress: {
            address1: cleanFormData.Basic_Info?.CurrentAddress?.address1 || "",
            address2: cleanFormData.Basic_Info?.CurrentAddress?.address2 || "",
            city: cleanFormData.Basic_Info?.CurrentAddress?.city || "",
            state: cleanFormData.Basic_Info?.CurrentAddress?.state || "",
            country: cleanFormData.Basic_Info?.CurrentAddress?.country || "",
            pincode: cleanFormData.Basic_Info?.CurrentAddress?.pincode || "",
          },
          PermentAddress: {
            address1: cleanFormData.Basic_Info?.PermentAddress?.address1 || "",
            address2: cleanFormData.Basic_Info?.PermentAddress?.address2 || "",
            city: cleanFormData.Basic_Info?.PermentAddress?.city || "",
            state: cleanFormData.Basic_Info?.PermentAddress?.state || "",
            country: cleanFormData.Basic_Info?.PermentAddress?.country || "",
            pincode: cleanFormData.Basic_Info?.PermentAddress?.pincode || "",
          },
        },

        Family_Info: {
          fatherName: cleanFormData.Family_Info?.fatherName || "",
          motherName: cleanFormData.Family_Info?.motherName || "",
          fathersOccupation: cleanFormData.Family_Info?.fathersOccupation || "",
          fathersMobileNo: cleanFormData.Family_Info?.fathersMobileNo || "",
          mothersMobileNo: cleanFormData.Family_Info?.mothersMobileNo || "",
          familyIncome: cleanFormData.Family_Info?.familyIncome || "",
          familymember: cleanFormData.Family_Info?.familymember || "",
        },

        // Fix professional experience dates and data types
        professional_Experience: Array.isArray(cleanFormData.professional_Experience)
          ? cleanFormData.professional_Experience.map((exp) => ({
            title: exp.title || "",
            employementType: exp.employementType || "",
            currentEmployer: exp.currentEmployer || "",
            organization: exp.organization || "",
            startDate: exp.startDate ? safeISODate(exp.startDate) : null,
            endDate: exp.endDate ? safeISODate(exp.endDate) : null,
            country: exp.country || "",
            state: exp.state || "",
            city: exp.city || "",
            location: exp.location || "",
            totalExpirnece: exp.totalExpirnece || "",
            description: exp.description || "",
            NoticePeriod: exp.NoticePeriod || "",
            isFresher: Boolean(exp.isFresher),
            isCurrentJob: Boolean(exp.isCurrentJob),
            salarysleep: Array.isArray(exp.salarysleep) ? exp.salarysleep : [],
            appointmentletter: exp.appointmentletter || "",
            Relievingletter: exp.Relievingletter || "",
            experinceletter: exp.experinceletter || "",
            Incrementletter: exp.Incrementletter || "",
          }))
          : [],

        KYC_Details: {
          pancardNo: cleanFormData.KYC_Details?.pancardNo || "",
          aadharcardNo: cleanFormData.KYC_Details?.aadharcardNo || "",
          passportNo: cleanFormData.KYC_Details?.passportNo || "",
          uanNumber: cleanFormData.KYC_Details?.uanNumber || "",
          VoterId: cleanFormData.KYC_Details?.VoterId || "",
        },

        // Fix education dates
        education: Array.isArray(cleanFormData.education)
          ? cleanFormData.education.map((edu) => ({
            educationType: edu.educationType || "",
            university: edu.university || "",
            Institute: edu.Institute || "",
            currentlyStudent: edu.currentlyStudent || "false",
            startDate: edu.startDate ? safeISODate(edu.startDate) : null,
            endDate: edu.endDate ? safeISODate(edu.endDate) : null,
            numberOfYears: edu.numberOfYears || "",
            finalScore: edu.finalScore || "",
            country: edu.country || "",
            state: edu.state || "",
            city: edu.city || "",
            yearOfPassing: edu.yearOfPassing || "",
            description: edu.description || "",
            masterdegree: edu.masterdegree || "",
            graduationdegress: edu.graduationdegress || "",
            certificate: edu.certificate || "",
          }))
          : [],

        Personal_Documents: {
          Aadhaar_front: cleanFormData.Personal_Documents?.Aadhaar_front || "",
          Aadhar_Back: cleanFormData.Personal_Documents?.Aadhar_Back || "",
          pancard: cleanFormData.Personal_Documents?.pancard || "",
          voterId: cleanFormData.Personal_Documents?.voterId || "",
          DrivingLicence: cleanFormData.Personal_Documents?.DrivingLicence || "",
          passportsizephoto: cleanFormData.Personal_Documents?.passportsizephoto || "",
          appointmentletter: cleanFormData.Personal_Documents?.appointmentletter || "",
          Relievingletter: cleanFormData.Personal_Documents?.Relievingletter || "",
          experinceletter: cleanFormData.Personal_Documents?.experinceletter || "",
          Incrementletter: cleanFormData.Personal_Documents?.Incrementletter || "",

          Address_proof: Array.isArray(cleanFormData.Personal_Documents?.Address_proof)
            ? cleanFormData.Personal_Documents.Address_proof.map((proof) => ({
              ElectricityBill: proof.ElectricityBill || "",
              RentAgreement: proof.RentAgreement || "",
              BGV_Documents: proof.BGV_Documents || "",
            }))
            : [{ ElectricityBill: "", RentAgreement: "", BGV_Documents: "" }],
          Others: Array.isArray(cleanFormData.Personal_Documents?.Others)
            ? cleanFormData.Personal_Documents.Others
            : [],
        },

        Bank_verification: {
          account_number: cleanFormData.Bank_verification?.account_number || "",
          ifsc: cleanFormData.Bank_verification?.ifsc || "",
          bank_name: cleanFormData.Bank_verification?.bank_name || "",
          name: cleanFormData.Bank_verification?.name || "",
          city: cleanFormData.Bank_verification?.city || "",
          branch: cleanFormData.Bank_verification?.branch || "",
          uan: cleanFormData.Bank_verification?.uan || "",
          EsicNumber: cleanFormData.Bank_verification?.EsicNumber || "",
          converUnderpf: cleanFormData.Bank_verification?.converUnderpf || "false",
          BankStatment: cleanFormData.Bank_verification?.BankStatment || "",
        },

        // Fix nominee data types - ensure strings for phone and pincode
        nominee: Array.isArray(cleanFormData.nominee)
          ? cleanFormData.nominee.map((nom) => ({
            nomineeName: nom.nomineeName || "",
            relationWithEmployee: nom.relationWithEmployee || "",
            nominationType: nom.nominationType || "",
            nominationAge: nom.nominationAge || "",
            nomineeAddress: nom.nomineeAddress || "",
            nomineeState: nom.nomineeState || "",
            nomineeDistrict: nom.nomineeDistrict || "",
            nomineeblock: nom.nomineeblock || "",
            nomineePanchayat: nom.nomineePanchayat || "",
            nomineePincode: nom.nomineePincode ? String(nom.nomineePincode) : "",
            nomineePhoneNumber: nom.nomineePhoneNumber ? String(nom.nomineePhoneNumber) : "",
            dob: nom.dob || "", // Keep as string, don't convert to ISO
            Aadhar_card: nom.Aadhar_card || "",
          }))
          : [],

        // Arrays with proper defaults
        jobAlerts: Array.isArray(cleanFormData.jobAlerts) ? cleanFormData.jobAlerts : [],
        SkillInfo: {
        skills: Array.isArray(cleanFormData.SkillInfo?.skills) ? cleanFormData.SkillInfo.skills : [],
        languagesKnown: Array.isArray(cleanFormData.SkillInfo?.languagesKnown) ? cleanFormData.SkillInfo.languagesKnown : [],
      },
        others: Array.isArray(cleanFormData.others) ? cleanFormData.others : [],

        // Job preferences with proper data types
        jobPreferences: {
          preferredLocations: Array.isArray(cleanFormData.jobPreferences?.preferredLocations)
            ? cleanFormData.jobPreferences.preferredLocations
            : [],
          jobType: cleanFormData.jobPreferences?.jobType || "",
          noticePeriodInDays: cleanFormData.jobPreferences?.noticePeriodInDays
            ? String(cleanFormData.jobPreferences.noticePeriodInDays)
            : "",
        },

        profileCompletionPercentage: Number(cleanFormData.profileCompletionPercentage) || 0,
      }

      const res = await axios.post(`${baseUrl}/v1/api/Auth/updateProfile`, requestBody, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        timeout: 30000, // 30 second timeout
      })

      if (res.data.status) {
        setSnackbar({
          open: true,
          message: res.data.message || "Profile updated successfully!",
          severity: "success",
        })
        const updatedPercent = calculateProfileCompletion(formData)
        setProgressPercentage(updatedPercent)
        await getCandidateProfile()
        JobApply()

      } else {
        setSnackbar({
          open: true,
          message: res.data.message,
          severity: "error",
        })
        throw new Error(res.data.message || "Update failed")
      }
    } catch (error) {
      console.error("API Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      })
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      })

      let errorMessage = "Failed to update profile"

      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again."
      } else if (error.response?.status === 413) {
        errorMessage = "Request too large. Please reduce file sizes."
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid data format"
      } else if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again."
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleProfilePicture = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setLoading(true)
      const formDataObj = new FormData()
      formDataObj.append("file", file)
      const res = await axios.post(`${baseUrl}/v1/api/upload/uploadSingle`, formDataObj)
      if (res.data.success) {
        setSnackbar({
          open: true,
          message: "Profile picture uploaded successfully!",
          severity: "success",
        })
        setFormData((prev) => ({
          ...prev,
          profilePicture: res.data.url,
        }))
      }
    } catch (error) {
      console.error("Upload error:", error)
      setSnackbar({
        open: true,
        message: "An error occurred while uploading the file.",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only show modal if no resume AND user hasn't explicitly chosen to skip
    if ((!formData.resume || formData.resume === "") && !hasSkippedResume) {
      setResumeModal(true)
    } else {
      setResumeModal(false)
    }
  }, [formData.resume, hasSkippedResume])

  // useEffect(() => {
  //   if (aiResponseData) {
  //     if (!parse) {
  //       setPreviousFormData(formData)
  //       const resume = aiResponseData
  //       const personal = resume.PersonalDetails || {}
  //       const work = resume.WorkExperience || []
  //       const education = resume.Education || []
  //       const technicalSkills = resume.TechnicalSkills || []
  //       const softSkills = resume.SoftSkills || []
  //       const languages = resume.Languages || []

  //       setFormData((prev) => ({
  //         ...prev,
  //         userName: personal.FullName ?? prev.userName ?? "",
  //         email: personal.Email ?? prev.email ?? "",
  //         mobileNumber: personal.Phone ?? prev.mobileNumber ?? "",
  //         summary: resume.ProfessionalSummary ?? prev.summary ?? "",
  //         resume: resumeUrl ?? prev.resume ?? "",
  //         Basic_Info: {
  //           ...prev.Basic_Info,
  //           socialAccounts:
  //             personal.LinkedIn != null
  //               ? [personal.LinkedIn, prev.Basic_Info?.socialAccounts?.[1] ?? ""]
  //               : (prev.Basic_Info?.socialAccounts ?? ["", ""]),
  //           CurrentAddress: {
  //             ...prev.Basic_Info?.CurrentAddress,
  //             address1: personal.Location ?? prev.Basic_Info?.CurrentAddress?.address1 ?? "",
  //           },
  //         },

  //         professional_Experience:
  //           work.length > 0
  //             ? work.map((w, i) => ({
  //                 title: w.JobTitle ?? prev.professional_Experience?.[i]?.title ?? "",
  //                 employementType: prev.professional_Experience?.[i]?.employementType ?? "",
  //                 currentEmployer: prev.professional_Experience?.[i]?.currentEmployer ?? "",
  //                 organization: w.CompanyName ?? prev.professional_Experience?.[i]?.organization ?? "",
  //                 startDate: w.StartDate ?? prev.professional_Experience?.[i]?.startDate ?? "",
  //                 endDate:
  //                   w.EndDate?.toLowerCase() === "present"
  //                     ? new Date().toISOString().split("T")[0]
  //                     : w.EndDate
  //                       ? w.EndDate
  //                       : (prev.professional_Experience?.[i]?.endDate ?? null),
  //                 country: prev.professional_Experience?.[i]?.country ?? "",
  //                 state: prev.professional_Experience?.[i]?.state ?? "",
  //                 city: prev.professional_Experience?.[i]?.city ?? "",
  //                 location: prev.professional_Experience?.[i]?.location ?? "",
  //                 totalExpirnece: prev.professional_Experience?.[i]?.totalExpirnece ?? "",
  //                 description: w.Responsibilities?.join(", ") ?? prev.professional_Experience?.[i]?.description ?? "",
  //                 NoticePeriod: prev.professional_Experience?.[i]?.NoticePeriod ?? "",
  //                 isFresher: prev.professional_Experience?.[i]?.isFresher ?? false,
  //                 isCurrentJob: prev.professional_Experience?.[i]?.isCurrentJob ?? false,
  //                 salarysleep: prev.professional_Experience?.[i]?.salarysleep ?? [],
  //                 appointmentletter: prev.professional_Experience?.[i]?.appointmentletter ?? "",
  //                 Relievingletter: prev.professional_Experience?.[i]?.Relievingletter ?? "",
  //                 experinceletter: prev.professional_Experience?.[i]?.experinceletter ?? "",
  //                 Incrementletter: prev.professional_Experience?.[i]?.Incrementletter ?? "",
  //               }))
  //             : (prev.professional_Experience ?? []),

  //         education:
  //           education.length > 0
  //             ? education.map((e, i) => ({
  //                 educationType: prev.education?.[i]?.educationType ?? "",
  //                 university: e.Institution ?? prev.education?.[i]?.university ?? "",
  //                 Institute: prev.education?.[i]?.Institute ?? "",
  //                 currentlyStudent: prev.education?.[i]?.currentlyStudent ?? "false",
  //                 startDate: prev.education?.[i]?.startDate ?? "",
  //                 endDate: prev.education?.[i]?.endDate ?? "",
  //                 numberOfYears: prev.education?.[i]?.numberOfYears ?? "",
  //                 finalScore: prev.education?.[i]?.finalScore ?? "",
  //                 country: prev.education?.[i]?.country ?? "",
  //                 state: prev.education?.[i]?.state ?? "",
  //                 city: prev.education?.[i]?.city ?? "",
  //                 yearOfPassing: e.GraduationYear ?? prev.education?.[i]?.yearOfPassing ?? "",
  //                 description: prev.education?.[i]?.description ?? "",
  //                 masterdegree: prev.education?.[i]?.masterdegree ?? "",
  //                 graduationdegress: e.Degree ?? prev.education?.[i]?.graduationdegress ?? "",
  //                 certificate: prev.education?.[i]?.certificate ?? "",
  //               }))
  //             : (prev.education ?? []),

  //         jobAlerts: prev.jobAlerts ?? [],
  //         skills: technicalSkills.length > 0 ? technicalSkills : (prev.skills ?? []),
  //         languagesKnown: languages.length > 0 ? languages : (prev.languagesKnown ?? []),

  //         jobPreferences: {
  //           ...prev.jobPreferences,
  //           preferredLocations: prev.jobPreferences?.preferredLocations ?? [],
  //           jobType: prev.jobPreferences?.jobType ?? "",
  //           noticePeriodInDays: Number(prev.jobPreferences?.noticePeriodInDays) ?? "",
  //         },

  //         expectedSalary: Number(prev.expectedSalary) ?? "",
  //         currentCTC: Number(prev.currentCTC) ?? "",
  //         Personal_Documents: prev.Personal_Documents ?? {},
  //         aboutUs: prev.aboutUs ?? "",
  //       }))
  //     } else {
  //       if (previousFormData) {
  //         setFormData(previousFormData)
  //       }
  //     }
  //   }
  // }, [aiResponseData, parse])




  // Add this function to handle resume analysis
  const handleResumeAnalysis = async (e) => {
    setFetching(true)
    setParse(false)
    const file = e.target.files[0]
    try {
      if (!file) {
        console.error("❌ Resume file is missing.")
        setSnackbar({
          open: true,
          message: "Please select a resume file to analyze",
          severity: "error",
        })
        return
      }
      setUploadedFile(file)
      const formDataObj = new FormData()
      formDataObj.append("image", file)

      setSnackbar({
        open: true,
        message: "Analyzing resume... This may take a moment.",
        severity: "info",
      })

      const response = await axios.post(
        "https://ai-api.fincooper.in/v1/api/employee/generate-ai-with-resume",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (response.data.status) {
        setAiResponseData(response.data.items.aiResponse.ResumeAnalysis)
        applyAiAnalysis(response.data.items.resumeUrl)
        // setResumeUrl(response.data.items.resumeUrl)



      } else {
        throw new Error("Failed to analyze resume")
      }
    } catch (error) {
      console.error("❌ Error analyzing resume:", error)
      setSnackbar({
        open: true,
        message: "Failed to analyze resume. Please try again or upload manually.",
        severity: "error",
      })
    } finally {
      setFetching(false)
    }
  }
const JobApply = async () => {
  const selectionData = JSON.parse(localStorage.getItem("selectedJobData"));
  const { jobPostId, branchId, departmentId } = selectionData;

  try {
    const response = await axios.post(
      `${baseUrl}/v1/api/job/jobapply`,
      { jobPostId,branchId,departmentId }, // sending as JSON body
      {
        headers: {
          authorization: token,
          'Content-Type': 'application/json',
        },
      }
    );

    // ✅ Handle success

    if (response.data.success) {
       setSnackbar({
        open: true,
        message: "Job application submitted successfully!.",
        severity: "success",
      });
      // You can redirect or update the UI here
    } else {
       setSnackbar({
        open: true,
        message: "Failed to apply for the job. Please try again.",
        severity: "error",
      });
    }
  } catch (error) {
    // ❌ Handle error
    console.error("Error applying for job:", error);

    if (error.response) {
      alert(`Error: ${error.response.data.message || "Something went wrong."}`);
    } else {
      alert("Network error. Please check your internet connection.");
    }
  }
};

  // Add this function to handle applying AI analysis to form data
  const applyAiAnalysis = (resumeUrl) => {
    if (!aiResponseData) {
      setSnackbar({
        open: true,
        message: "No analysis data available. Please analyze your resume first.",
        severity: "warning",
      })
      return
    }
    // setParse(true)
    const resumedata = aiResponseData
    const personal = resumedata.PersonalDetails || {}
    const work = resumedata.WorkExperience || []
    const education = resumedata.Education || []
    const technicalSkills = resumedata.TechnicalSkills || []
    const softSkills = resumedata.SoftSkills || []
    const languages = resumedata.Languages || []


    setFormData((prev) => ({
      ...prev,
      userName: personal.FullName ?? prev.userName ?? "",
      // email: personal.Email ?? prev.email ?? "",
      mobileNumber: personal.Phone ?? prev.mobileNumber ?? "",
      summary: resumedata.ProfessionalSummary ?? prev.summary ?? "",
      resume: resumeUrl,
      Basic_Info: {
        ...prev.Basic_Info,
        Name: personal.FullName ?? prev.Basic_Info?.Name ?? "",
        email: personal.Email ?? prev.Basic_Info?.email ?? "",
        socialAccounts:
          personal.LinkedIn != null
            ? [personal.LinkedIn, ...(prev.Basic_Info?.socialAccounts?.filter(Boolean) || [])]
            : prev.Basic_Info?.socialAccounts || [],
        CurrentAddress: {
          ...prev.Basic_Info?.CurrentAddress,
          address1: personal.Address?.Street ?? prev.Basic_Info?.CurrentAddress?.address1 ?? "",
          city: personal.Address?.City ?? prev.Basic_Info?.CurrentAddress?.city ?? "",
          ctate: personal.Address?.State ?? prev.Basic_Info?.CurrentAddress?.state ?? "",
          country: personal.Address?.Country ?? prev.Basic_Info?.CurrentAddress?.country ?? "",

        },
        ResumeAddress: (
          (personal.Address?.Street ? personal.Address.Street : "") +
          (personal.Address?.City ? ", " + personal.Address.City : "") +
          (personal.Address?.State ? ", " + personal.Address.State : "") +
          (personal.Address?.Country ? ", " + personal.Address.Country : "")
        ).replace(/^, /, "") || prev.ResumeAddress || ""

      },

      professional_Experience:
        work.length > 0
          ? work.map((w, i) => ({
            title: w.JobTitle ?? "",
            employementType: "",
            currentEmployer: w.EndDate?.toLowerCase() === "present" ? "Yes" : "No",
            organization: w.CompanyName ?? "",
            startDate: w.StartDate ?? null,
            endDate: w.EndDate ?? null,
            country: "",
            state: "",
            city: "",
            location: w.Location ?? "",
            totalExpirnece: "",
            description: w.Responsibilities?.join(", ") ?? "",
            NoticePeriod: "",
            isFresher: false,
            isCurrentJob: w.EndDate?.toLowerCase() === "present",
            salarysleep: [],
            appointmentletter: "",
            Relievingletter: "",
            experinceletter: "",
            Incrementletter: "",
          }))
          : prev.professional_Experience,

      education:
        education.length > 0
          ? education.map((e, i) => ({
            educationType: e.Degree?.includes("Bachelor") ? "Graduation" :
              e.Degree?.includes("Master") ? "Post Graduation" :
                e.Degree?.includes("Ph") ? "PhD" : "",
            university: e.Institution ?? "",
            Institute: e.Institution ?? "",
            currentlyStudent: "false",
            startDate: null,
            endDate: null,
            numberOfYears: "",
            finalScore: "",
            country: "",
            state: "",
            city: "",
            yearOfPassing: e.GraduationYear ?? "",
            description: "",
            masterdegree: e.Degree?.includes("Master") ? e.Degree : "",
            graduationdegress: e.Degree?.includes("Bachelor") ? e.Degree : "",
            certificate: "",
          }))
          : prev.education,
      SkillInfo: {
        skills: [...technicalSkills, ...softSkills].filter(Boolean),
        languagesKnown: languages.filter(Boolean),
      }
    }))
    setTimeout(() => {
      const missingFields = getMissingRequiredFields()
      if (missingFields.length > 0) {
        setShowMissingFieldsDialog(true)
      }
    }, 1000)

    handleSubmit()
    setSnackbar({
      open: true,
      message: "AI analysis applied to form fields successfully!",
      severity: "success",
    })
  }

  const handleMissingFieldsComplete = () => {
    setSnackbar({
      open: true,
      message: "Profile completed successfully! All required fields are filled.",
      severity: "success",
    })
  }

  // Add this modal component for resume analysis
  const ResumeAnalysisModal = () => {
    return (
      <Dialog
        open={resumeModal}
        onClose={() => setHasSkippedResume(true)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              Resume Analysis
            </Typography>
            <IconButton onClick={() => setHasSkippedResume(true)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="body1" gutterBottom>
              Upload your resume to automatically fill in your profile details. Our AI will analyze your resume and extract relevant information.
            </Typography>

            <Box sx={{ mt: 3, mb: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 3,
                  width: "100%",
                  textAlign: "center",
                  mb: 2,
                  cursor: "pointer",
                  "&:hover": { borderColor: "primary.main" },
                }}
                onClick={() => document.getElementById("resume-upload-input").click()}
              >
                <input
                  id="resume-upload-input"
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeAnalysis}
                />
                <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Click to upload or drag and drop
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Supports PDF, DOC, DOCX (Max 5MB)
                </Typography>
              </Box>

              {uploadedFile && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <InsertDriveFile color="primary" />
                  <Typography variant="body2">{uploadedFile.name}</Typography>
                </Box>
              )}

              {fetching && (
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <CircularProgress size={40} sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Analyzing your resume... This may take a moment.
                  </Typography>
                </Box>
              )}

              {aiResponseData && Object.keys(aiResponseData).length > 0 && (
                <Box sx={{ mt: 3, width: "100%" }}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Resume analyzed successfully! Click "Apply Analyser" to fill your profile with the extracted data.
                  </Alert>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>View Analysis Results</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ maxHeight: "300px", overflow: "auto" }}>
                        {aiResponseData.PersonalDetails && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Personal Details</Typography>
                            <Typography variant="body2">
                              Name: {aiResponseData.PersonalDetails.FullName || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              Email: {aiResponseData.PersonalDetails.Email || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              Phone: {aiResponseData.PersonalDetails.Phone || "N/A"}
                            </Typography>
                            <Typography variant="body2">
                              Location: {aiResponseData.PersonalDetails.Location || "N/A"}
                            </Typography>
                          </Box>
                        )}

                        {aiResponseData.WorkExperience && aiResponseData.WorkExperience.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Work Experience</Typography>
                            {aiResponseData.WorkExperience.map((exp, index) => (
                              <Box key={index} sx={{ mb: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {exp.JobTitle} at {exp.CompanyName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {exp.StartDate} - {exp.EndDate}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {aiResponseData.Education && aiResponseData.Education.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Education</Typography>
                            {aiResponseData.Education.map((edu, index) => (
                              <Box key={index} sx={{ mb: 1 }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {edu.Degree}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {edu.Institution}, {edu.GraduationYear || "N/A"}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {aiResponseData.TechnicalSkills && aiResponseData.TechnicalSkills.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">Technical Skills</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {aiResponseData.TechnicalSkills.map((skill, index) => (
                                <Chip key={index} label={skill} size="small" />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setHasSkippedResume(true)} color="inherit">
            Skip
          </Button>
          <Button
            onClick={applyAiAnalysis}
            variant="contained"
            disabled={!aiResponseData || Object.keys(aiResponseData).length === 0 || fetching}
          >
            Apply Job
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const MissingFieldsDialog = ({ open, onClose, onComplete }) => {

    const [missingFields, setMissingFields] = useState([])
    const [localFormData, setLocalFormData] = useState({})

    useEffect(() => {
      if (open) {
        const missing = getMissingRequiredFields()
        setMissingFields(missing)

        // Initialize local form data with current values
        setLocalFormData({
          userName: formData.userName || "",
          email: formData.email || "",
          mobileNumber: formData.mobileNumber || "",
          fullName: formData.Basic_Info?.Name || "",
          gender: formData.Basic_Info?.gender || "",
          dob: formData.Basic_Info?.dob || "",
          // skills: formData.skills ? formData.skills.join(", ") : "",
          ResumeAddress: formData.Basic_Info?.ResumeAddress || "",

          // address1: formData.Basic_Info?.CurrentAddress?.address1 || "",
          // city: formData.Basic_Info?.CurrentAddress?.city || "",
          // state: formData.Basic_Info?.CurrentAddress?.state || "",
          // pincode: formData.Basic_Info?.CurrentAddress?.pincode || "",
        })
      }
    }, [open, formData])

    const handleInputChange = (field, value) => {
      setLocalFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    const handleSave = () => {
      // Update the main form data with the filled values
      const updatedFormData = {
        ...formData,
        userName: localFormData.userName || formData.userName,
        email: localFormData.email || formData.email,
        mobileNumber: localFormData.mobileNumber || formData.mobileNumber,
        // skills: localFormData.skills
        //   ? localFormData.skills
        //     .split(",")
        //     .map((s) => s.trim())
        //     .filter(Boolean)
        //   : formData.skills,
        Basic_Info: {
          ...formData.Basic_Info,
          Name: localFormData.fullName || formData.Basic_Info?.Name,
          gender: localFormData.gender || formData.Basic_Info?.gender,
          dob: localFormData.dob || formData.Basic_Info?.dob,
          ResumeAddress: localFormData.ResumeAddress || formData.Basic_Info?.ResumeAddress,

          // CurrentAddress: {
          //   ...formData.Basic_Info?.CurrentAddress,
          //   address1: localFormData.address1 || formData.Basic_Info?.CurrentAddress?.address1,
          //   city: localFormData.city || formData.Basic_Info?.CurrentAddress?.city,
          //   state: localFormData.state || formData.Basic_Info?.CurrentAddress?.state,
          //   pincode: localFormData.pincode || formData.Basic_Info?.CurrentAddress?.pincode,
          // },
        },
      }

      setFormData(updatedFormData)
      onComplete && onComplete()
      // onClose()
    }

    const renderField = (fieldName) => {
      switch (fieldName) {
        case "Username":
          return (
            <TextField
              key="userName"
              fullWidth
              label="Username"
              value={localFormData.userName}
              onChange={(e) => handleInputChange("userName", e.target.value)}
              margin="normal"
              required
            />
          )

        case "Email":
          return (
            <TextField
              key="email"
              fullWidth
              label="Email"
              type="email"
              value={localFormData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              margin="normal"
              required
            />
          )

        case "Mobile Number":
          return (
            <TextField
              key="mobileNumber"
              fullWidth
              label="Mobile Number"
              value={localFormData.mobileNumber}
              onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
              margin="normal"
              required
            />
          )

        case "Full Name":
          return (
            <TextField
              key="fullName"
              fullWidth
              label="Full Name"
              value={localFormData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              margin="normal"
              required
            />
          )

        case "Gender":
          return (
            <FormControl key="gender" fullWidth margin="normal" required>
              <InputLabel>Gender</InputLabel>
              <Select
                value={localFormData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
          )

        case "Date of Birth":
          return (
            <TextField
              key="dob"
              fullWidth
              label="Date of Birth"
              type="date"
              value={localFormData.dob}
              onChange={(e) => handleInputChange("dob", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          )

        // case "Skills":
        //   return (
        //     <TextField
        //       key="skills"
        //       fullWidth
        //       label="Skills (comma separated)"
        //       value={localFormData.skills}
        //       onChange={(e) => handleInputChange("skills", e.target.value)}
        //       margin="normal"
        //       multiline
        //       rows={2}
        //       placeholder="e.g., JavaScript, React, Node.js"
        //       required
        //     />
        //   )

        case "ResumeAddress":
          return (
            <TextField
              key="address1"
              fullWidth
              label="ResumeAddress"
              value={localFormData.ResumeAddress}
              onChange={(e) => handleInputChange("ResumeAddress", e.target.value)}
              margin="normal"
              multiline
              rows={2}
              required
            />
          )

        // case "City":
        //   return (
        //     <TextField
        //       key="city"
        //       fullWidth
        //       label="City"
        //       value={localFormData.city}
        //       onChange={(e) => handleInputChange("city", e.target.value)}
        //       margin="normal"
        //       required
        //     />
        //   )

        // case "State":
        //   return (
        //     <TextField
        //       key="state"
        //       fullWidth
        //       label="State"
        //       value={localFormData.state}
        //       onChange={(e) => handleInputChange("state", e.target.value)}
        //       margin="normal"
        //       required
        //     />
        //   )

        // case "Pincode":
        //   return (
        //     <TextField
        //       key="pincode"
        //       fullWidth
        //       label="Pincode"
        //       value={localFormData.pincode}
        //       onChange={(e) => handleInputChange("pincode", e.target.value)}
        //       margin="normal"
        //       required
        //     />
        //   )

        default:
          return null
      }
    }

    if (missingFields.length === 0) {
      return null
    }


    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: "400px" },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              Complete Missing Information
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            Please fill in the following required fields to complete your profile:
          </Alert>

          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
            Missing Fields ({missingFields.length})
          </Typography>

          <Box sx={{ mb: 2 }}>
            {missingFields.map((field, index) => (
              <Typography key={index} variant="body2" color="error" sx={{ mb: 0.5 }}>
                • {field}
              </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {missingFields.map((fieldName) => (
              <Grid item xs={12} sm={6} key={fieldName}>
                {renderField(fieldName)}
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} color="inherit">
            Skip for Now
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save & Continue
          </Button>
        </DialogActions>
      </Dialog>
    )
  }


  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
          <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
            Form Stage Progress
          </Typography>

          <Stepper activeStep={formStages.findIndex(s => s.stageName === selectedStage)} alternativeLabel>
            {formStages.map((stage, index) => (
              <Step key={stage.stageName}>
                <StepLabel>{stage.stageName}</StepLabel>
              </Step>
            ))}
          </Stepper>


        </Paper>


        {/* Profile Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            position: "relative",
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={3} sx={{ display: "flex", justifyContent: "center" }}>
              <Box textAlign="center">
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  type="file"
                  id="upload-photo"
                  hidden
                  onChange={handleProfilePicture}
                />
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        cursor: "pointer",
                        width: 30,
                        height: 30,
                        border: "2px solid white",
                      }}
                      onClick={handleProfilePictureClick}
                    >
                      <CameraAlt sx={{ fontSize: 18 }} />
                    </Avatar>
                  }
                >
                  <Avatar
                    src={formData.profilePicture || ""}
                    sx={{
                      width: 120,
                      height: 120,
                      border: "4px solid white",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    }}
                  >
                    {formData.Basic_Info?.Name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                </Badge>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Box>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  {formData.Basic_Info?.Name || formData.userName || "Loading..."}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {formData.professional_Experience?.[0]?.title || "Job Title"} at{" "}
                  {formData.professional_Experience?.[0]?.organization || "Company"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formData.email || "email@example.com"}
                    </Typography>
                  </Box>
                  {/* {formData.profileCompletionPercentage > 0 && (
                    <Chip
                      label={`${formData.profileCompletionPercentage}% Complete`}
                      color={formData.profileCompletionPercentage >= 80 ? "success" : "warning"}
                      size="small"
                    />
                  )} */}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Dynamic Tabs based on active stage keys */}
        {availableTabs.length > 0 ? (
          <Paper sx={{ borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            {/* Tab Headers */}
            <Box sx={{ borderBottom: 1, borderColor: "divider", overflowX: "auto" }}>
              <Box sx={{ display: "flex" }}>
                {availableTabs.map((tab, index) => (
                  <Box
                    key={tab.key}
                    onClick={() => setActiveTab(index)}
                    sx={{
                      py: 2,
                      px: 3,
                      minWidth: 120,
                      textAlign: "center",
                      cursor: "pointer",
                      fontWeight: activeTab === index ? 600 : 400,
                      color: activeTab === index ? "primary.main" : "text.primary",
                      borderBottom: activeTab === index ? 2 : 0,
                      borderColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    {tab.icon}
                    <Typography variant="body1" sx={{ textTransform: "none" }}>
                      {tab.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Tab Content */}
            {renderTabContent()}
          </Paper>
        ) : (
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No active stages found for the selected form stage.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please select a different stage or contact your administrator to activate form stages.
              </Typography>
            </Box>
          </Paper>
        )}
        {/* <ResumeAnalysisModal /> */}
        {/* <MissingFieldsDialog
          open={showMissingFieldsDialog}
          onClose={() => setShowMissingFieldsDialog(false)}
          formData={formData}
          setFormData={setFormData}
          onComplete={handleMissingFieldsComplete}
        /> */}
      </Container>
    </Box>
  )
}

export default CandidateProfile

