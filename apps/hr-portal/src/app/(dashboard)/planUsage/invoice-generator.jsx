"use client"

import jsPDF from "jspdf"

export class InvoiceGenerator {
  static async fetchOrganizationInfo(callApi) {
    try {
      const response = await callApi({
        endpoint: "/v1/api/org/getOrganizations",
        method: "GET",
        disableSnackbar: true,
      })
      const result = response.data

      if (result.status && result.items && result.items.length > 0) {
        const org = result.items[0] // Get first organization
        return {
          name: org.name,
          contactPerson: org.contactPerson || org.userId?.name || "Customer",
          email: org.contactEmail || org.userId?.email || "",
          addressLine1: org.addressLine1,
          addressLine2: org.addressLine2,
          city: org.city,
          state: org.state,
          country: org.country,
          zipCode: org.zipCode,
          gstNumber: org.GSTNumber,
          panNumber: org.Pan,
        }
      }
      return null
    } catch (error) {
      console.error("Error fetching organization info:", error)
      return null
    }
  }

  static async generateInvoice(paymentData, callApi) {
    const pdf = new jsPDF()

    // Fetch buyer/customer information from organization API using callApi
    const buyerInfo = await this.fetchOrganizationInfo(callApi)

    // Static Seller Details for RecruitExe
    const sellerInfo = {
      name: "Fincoopers Tech India Pvt. Ltd.",
      addressLine1: "201, Diamond Trade Centre",
      addressLine2: "Near Janjeerwala Square",
      city: "Indore, M.P 452001",
      phone: "+91 9893035149",
      email: "fintech@fincoopers.in",
      website: "https://fincooperstech.com/",
      gst: "23AAGCF0013K1Z5",
    }

    // Default buyer info if API fails
    const defaultBuyerInfo = {
      name: "[Customer Name]",
      contactPerson: "[Customer Name]",
      email: "[Customer Email]",
      addressLine1: "[Customer's Billing Address]",
      addressLine2: "",
      city: "[City, State, PIN]",
      gstNumber: "[Customer's GST Number]",
    }

    const customerInfo = buyerInfo || defaultBuyerInfo


    // Set up the PDF
    pdf.setFontSize(20)
    pdf.setFont(undefined, "bold")
    pdf.text("INVOICE", 105, 30, { align: "center" })

    // Seller Details Section (Left side)
    pdf.setFontSize(12)
    pdf.setFont(undefined, "bold")
    pdf.text("Seller Details:", 20, 50)

    pdf.setFontSize(14)
    pdf.setFont(undefined, "bold")
    pdf.text(sellerInfo.name, 20, 58)

    pdf.setFontSize(10)
    pdf.setFont(undefined, "normal")
    pdf.text(`Address: ${sellerInfo.addressLine1}`, 20, 66)
    if (sellerInfo.addressLine2) {
      pdf.text(sellerInfo.addressLine2, 20, 72)
    }
    pdf.text(sellerInfo.city, 20, 78)
    pdf.text(`Phone: ${sellerInfo.phone}`, 20, 84)
    pdf.text(`Email: ${sellerInfo.email}`, 20, 90)
    pdf.text(`GSTIN: ${sellerInfo.gst}`, 20, 96)

    // Invoice Details (Right side)
    const invoiceNumber = `INV-${paymentData.orderId}`
    const invoiceDate = paymentData.paymentDate
      ? new Date(paymentData.paymentDate).toLocaleDateString("en-IN")
      : new Date(paymentData.createdAt).toLocaleDateString("en-IN")

    pdf.setFontSize(10)
    pdf.setFont(undefined, "bold")
    pdf.text("Date:", 120, 50)
    pdf.text("Invoice No:", 120, 58)
    pdf.text("Transaction ID:", 120, 66)

    pdf.setFont(undefined, "normal")
    pdf.text(invoiceDate, 150, 50)
    pdf.text(invoiceNumber, 150, 58)
    pdf.text(paymentData.transactionId || "N/A", 150, 66)

    // Line separator
    pdf.line(20, 105, 190, 105)

    // Buyer Details Section
    pdf.setFontSize(12)
    pdf.setFont(undefined, "bold")
    pdf.text("Buyer Details:", 20, 120)

    pdf.setFontSize(10)
    pdf.setFont(undefined, "normal")

    // Use actual customer data if available
    const fullName = customerInfo.contactPerson || customerInfo.name
    const companyName =
      customerInfo.name !== customerInfo.contactPerson ? customerInfo.name : "[Customer's Business Name]"
    const billingAddress = customerInfo.addressLine1
      ? `${customerInfo.addressLine1}${customerInfo.addressLine2 ? ", " + customerInfo.addressLine2 : ""}`
      : "[Customer's Billing Address]"
    const cityStatePin =
      customerInfo.city && customerInfo.state && customerInfo.zipCode
        ? `${customerInfo.city}, ${customerInfo.state} ${customerInfo.zipCode}`
        : "[City, State, PIN]"
    const gstNumber = customerInfo.gstNumber || "[Customer's GST Number]"

    pdf.text(`Full Name: ${fullName}`, 20, 130)
    pdf.text(`Company Name: ${companyName}`, 20, 137)
    pdf.text(`Billing Address: ${billingAddress}`, 20, 144)
    pdf.text(`${cityStatePin}`, 20, 151)
    pdf.text(`GSTIN: ${gstNumber}`, 20, 158)

    // Items Table Header
    const tableStartY = 175
    pdf.setFontSize(10)
    pdf.setFont(undefined, "bold")

    // Table headers
    pdf.text("S.NO", 20, tableStartY)
    pdf.text("DESCRIPTION", 40, tableStartY)
    pdf.text("AMOUNT", 160, tableStartY)

    // Table header line
    pdf.line(20, tableStartY + 3, 190, tableStartY + 3)

    // Table content
    pdf.setFont(undefined, "normal")
    let currentY = tableStartY + 15

    const isPlanType = paymentData.planType === "Plan"
    const description = isPlanType
      ? `RECRUITEXE ${paymentData.planId?.planName?.toUpperCase() || "PLAN"}`
      : `RECRUITEXE AI CREDITS - ${paymentData.numberOfCredits || 0} Credits`

    const amount = this.formatPrice(paymentData.Amount)

    pdf.text("1", 20, currentY)
    pdf.text(description, 40, currentY)
    pdf.text(amount, 160, currentY)

    currentY += 20

    // Totals section
    pdf.line(20, currentY, 190, currentY)
    currentY += 10

    const total = paymentData.Amount
    const gstRate = 18
    const gstAmount = (total * gstRate) / (100 + gstRate)
    const subtotal = total - gstAmount
    const cgstAmount = gstAmount / 2
    const sgstAmount = gstAmount / 2

    pdf.setFont(undefined, "normal")
    pdf.text("Sub Total:", 130, currentY)
    pdf.text(this.formatPrice(subtotal), 160, currentY)

    currentY += 8
    pdf.text("CGST @ 9%:", 130, currentY)
    pdf.text(this.formatPrice(cgstAmount), 160, currentY)

    currentY += 8
    pdf.text("SGST @ 9%:", 130, currentY)
    pdf.text(this.formatPrice(sgstAmount), 160, currentY)

    currentY += 8
    pdf.line(130, currentY, 190, currentY)
    currentY += 8

    pdf.setFontSize(12)
    pdf.setFont(undefined, "bold")
    pdf.text("GRAND TOTAL:", 130, currentY)
    pdf.text(this.formatPrice(total), 160, currentY)

    // Terms and Conditions
    currentY += 25
    pdf.setFontSize(10)
    pdf.setFont(undefined, "bold")
    pdf.text("Terms and Conditions:", 20, currentY)

    currentY += 8
    pdf.setFont(undefined, "normal")
    const terms = [
      "• All purchases made through RecruitExe are final and non-refundable. Please review your",
      "  selected plan and billing details before proceeding with payment.",
      "• Each analysis or resume processed will deduct credit from your wallet. Ensure you have",
      "  sufficient balance before using the services.",
      "• Changes to invoice details post-payment are not permitted.",
      "• Use of the platform must comply with fair usage policies. Automated or abusive access",
      "  to RecruitExe services may lead to account suspension.",
    ]

    terms.forEach((term) => {
      pdf.text(term, 20, currentY)
      currentY += 5
    })

    // Footer
    const footerY = 270
    pdf.setFontSize(8)
    pdf.setFont(undefined, "bold")
    pdf.text("Thank you for business with us!", 105, footerY, { align: "center" })

    pdf.setFont(undefined, "normal")
    // pdf.text(sellerInfo.email, 140, footerY + 7)
    pdf.text(sellerInfo.website, 140, footerY + 6)

    return pdf
  }

  static formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price)
  }

  static async downloadInvoice(paymentData, callApi) {
    try {
      const pdf = await this.generateInvoice(paymentData, callApi)
      const fileName = `RecruitExe_Invoice_${paymentData.orderId}_${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)
      return true
    } catch (error) {
      console.error("Error generating invoice:", error)
      return false
    }
  }

  static async previewInvoice(paymentData, callApi) {
    try {
      const pdf = await this.generateInvoice(paymentData, callApi)
      const pdfBlob = pdf.output("blob")
      const url = URL.createObjectURL(pdfBlob)
      window.open(url, "_blank")
      return true
    } catch (error) {
      console.error("Error previewing invoice:", error)
      return false
    }
  }
}
