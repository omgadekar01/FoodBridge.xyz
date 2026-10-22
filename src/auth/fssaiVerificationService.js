const DEMO_FAILURE_LICENSE = '00000000000000'

export async function verifyFssaiLicenseDemo(licenseNumber) {
  if (!/^\d{14}$/.test(licenseNumber)) {
    throw new Error('Enter exactly 14 digits.')
  }

  await new Promise((resolve) => window.setTimeout(resolve, 900))

  if (licenseNumber === DEMO_FAILURE_LICENSE) {
    return { status: 'demo-failed' }
  }

  return { status: 'demo-approved' }
}
