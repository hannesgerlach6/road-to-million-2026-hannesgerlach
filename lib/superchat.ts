// Superchat WhatsApp API Helper

const SUPERCHAT_API_KEY = process.env.SUPERCHAT_API_KEY || ''
const SUPERCHAT_BASE_URL = 'https://api.superchat.de/v1'

export interface SendMessageParams {
  to: string // WhatsApp number with country code, e.g. +491234567890
  message: string
}

export async function sendWhatsAppMessage({ to, message }: SendMessageParams): Promise<{ success: boolean; error?: string }> {
  // Check if API key is set
  if (!SUPERCHAT_API_KEY) {
    console.error('SUPERCHAT_API_KEY is not set in environment variables')
    return { success: false, error: 'API Key nicht konfiguriert. Bitte in Vercel Environment Variables setzen.' }
  }

  try {
    // Format phone number - remove spaces, ensure +
    let formattedPhone = to.replace(/\s/g, '')
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone
    }

    console.log('Sending to Superchat:', { to: formattedPhone, messageLength: message.length })

    const response = await fetch(`${SUPERCHAT_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPERCHAT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: 'whatsapp',
        to: formattedPhone,
        body: {
          text: message,
        },
      }),
    })

    const responseText = await response.text()
    console.log('Superchat Response:', response.status, responseText)

    if (!response.ok) {
      return { success: false, error: `Superchat API Error (${response.status}): ${responseText}` }
    }

    return { success: true }
  } catch (error) {
    console.error('Superchat API Error:', error)
    return { success: false, error: String(error) }
  }
}

// Message Templates
export const MessageTemplates = {
  prayerReminder: (prayer: string, time: string) => 
    `🕌 *Gebetszeit in 10 Minuten*\n\n${prayer} um ${time}\n\nAllahu Akbar 🤲`,

  morningSummary: (data: { 
    prayers: { name: string; time: string }[], 
    meals: { time: string; name: string }[],
    habits: string[],
    workout?: string
  }) => {
    let msg = `☀️ *Guten Morgen Hannes!*\n\n`
    msg += `📅 Dein Tag heute:\n\n`
    
    msg += `🕌 *Gebetszeiten:*\n`
    data.prayers.forEach(p => {
      msg += `• ${p.name}: ${p.time}\n`
    })
    
    msg += `\n🍽️ *Mahlzeiten:*\n`
    data.meals.forEach(m => {
      msg += `• ${m.time} - ${m.name}\n`
    })
    
    msg += `\n✅ *Habits für heute:*\n`
    data.habits.forEach(h => {
      msg += `• ${h}\n`
    })
    
    if (data.workout) {
      msg += `\n💪 *Workout:*\n${data.workout}\n`
    }
    
    msg += `\nBismillah, pack es an! 🔥`
    return msg
  },

  eveningCheck: (completed: number, total: number, missing: string[]) => {
    let msg = `🌙 *Abend-Check*\n\n`
    msg += `Du hast heute *${completed}/${total}* Habits erledigt.\n\n`
    
    if (missing.length > 0) {
      msg += `❌ *Noch offen:*\n`
      missing.forEach(m => {
        msg += `• ${m}\n`
      })
      msg += `\nNoch Zeit bis Mitternacht! 💪`
    } else {
      msg += `✅ *Alles erledigt!*\n\nMashallah, starker Tag! 🏆`
    }
    
    return msg
  },

  mealReminder: (meal: { name: string; recipe?: string; calories: number; protein: number }) => {
    let msg = `🍽️ *Zeit zum Essen!*\n\n`
    msg += `*${meal.name}*\n`
    msg += `📊 ${meal.calories} kcal | ${meal.protein}g Protein\n`
    
    if (meal.recipe) {
      msg += `\n📝 *Rezept:*\n${meal.recipe}`
    }
    
    return msg
  },

  workoutReminder: (exercises: { name: string; sets: number; reps: string }[]) => {
    let msg = `💪 *Workout Zeit!*\n\n`
    exercises.forEach(e => {
      msg += `• ${e.name}: ${e.sets}x${e.reps}\n`
    })
    msg += `\nYallah, let's go! 🔥`
    return msg
  },

  koranReminder: () => 
    `📖 *Koran-Reminder*\n\nNimm dir 10-15 Minuten Zeit zum Lesen.\n\nبِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم`,
}
