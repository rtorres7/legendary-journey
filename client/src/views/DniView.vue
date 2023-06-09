<template>
  <section>
    <div class="container mx-auto">
      <br /><br />
      <p>
        The following logos are commonly associated with groups designated as
        foreign terrorist organizations (including their subsidiaries) by the
        Secretary of State under section 219(a) of the Immigration and
        Nationality Act (INA). These emblems have been found on documents,
        jewelry, posters, media releases, and other materials and displaying
        them may indicate membership or financial or general support. This
        graphic updates information published in June 2022 by revising logos for
        ISIS-Mozambique and ISIS-Sahel.
      </p>
      <br /><br />
      <div class="lg:gap-2 lg:grid lg:grid-cols-4">
        <div v-for="image in images" :key="image.id" class="w-full rounded">
          <img :src="image.photo" :alt="image.alt" :label="image.title" />
          <p>{{ image.title }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      images: [
        {
          id: 1,
          alt: "Abdallah Azzam Brigades flag",
          photo: "/images/aab.png",
          title: "‘Abdallah‘Azzam Brigades (AAB)",
        },

        {
          alt: "Abu Sayyaf Group flag",
          photo: "/images/abu_sayyaf_group.jpg",
          title: "AbuSayyaf Group (ASG)",
        },

        {
          alt: "Al-Aqsa Matrys Brigade flag",
          photo: "/images/aqsa.png",
          title: "Al-Aqsa Martyrs Brigade (AAMB)",
        },

        {
          alt: "al-Ashtar Brigades flag",
          photo: "/images/aab_2.png",
          title: "Al-AshtarBrigades (AAB)",
        },

        {
          alt: "Al-Murabitun flag",
          photo: "/images/al_murabitun_flag.jpg",
          title: "Al-Murabitun (formerly Al-Mulathamun Battalion) ",
        },

        {
          alt: "Al-Qa‘ida flag",
          photo: "/images/al-qaida_flag2.jpg",
          title: "Al-Qa‘ida",
        },

        {
          alt: "al-Qa‘ida in the Arabian Peninsula flag",
          photo: "/images/aqap.png",
          title: "Al-Qa‘ida in the Arabian Peninsula (AQAP)",
        },

        {
          alt: "al-Qa‘ida in the Indian Subcontinent flag",
          photo: "/images/al-qaida_indian_sub.png",
          title: "Al-Qa‘ida in the Indian Subcontinent (AQIS)",
        },

        {
          alt: "al-Qa‘ida in the Islamic Maghreb flag",
          photo: "/images/aqim.png",
          title: " Al-Qa‘ida in the Lands of the Islamic Maghreb (AQIM) ",
        },

        {
          alt: "al-Shabaab flag",
          photo: "/images/al-shabaab.png",
          title: "Al-Shabaab",
        },

        {
          alt: "Ansar al-Dine flag",
          photo: "/images/aad.png",
          title: "Ansar al-Dine(AAD)",
        },

        {
          alt: "Ansar al-Islam flag",
          photo: "/images/ansar_al-islam2.png",
          title: "Ansaral-Islam (AAI)",
        },

        {
          alt: "Ansar al-Shari’a in Benghazi flag",
          photo: "/images/ansar_al-sharia.png",
          title: "Ansar al-Sharia in Benghazi",
        },

        {
          alt: "Ansar al-Shari’a in Darnah flag",
          photo: "/images/ansar_al-sharia.png",
          title: "Ansar al-Sharia in Darnah",
        },

        {
          alt: "Ansar al-Shari’a in Tunisia flag",
          photo: "/images/ansar_al-sharia_tunisia.png",
          title: "Ansar al-Sharia in Tunisia",
        },

        { alt: "Ansaru flag", photo: "/images/ansaru.png", title: "Ansaru" },

        {
          alt: "Army of Islam (Palestinian) flag",
          photo: "/images/army_of_islam.png",
          title: "Army of Islam",
        },

        {
          alt: "Asa’ib Ahl al-Haqq (AAH) flag",
          photo: "/images/aah.png",
          title: "‘Asa‘ib Ahl al-Haqq (AAH)",
        },

        {
          alt: "Asbat al-Ansar flag",
          photo: "/images/aaa.jpg",
          title: "Asbat al-Ansar (AAA)",
        },

        {
          alt: "Boko Haram flag",
          photo: "/images/boko.png",
          title: "Boko Haram",
        },

        {
          alt: "CPP/NPA flag",
          photo: "/images/new_peoples_army_v3.png",
          title:
            "Communist Party of the Philippines/New People’s Army (CPP/NPA) ",
        },

        {
          alt: "Continuity Irish Republican Army flag",
          photo: "/images/cira.png",
          title: "Continuity Irish Republican Army (CIRA)",
        },

        { alt: "HAMAS flag", photo: "/images/hamas.png", title: "HAMAS" },

        {
          alt: "No image available",
          photo: "/images/no-logo.png",
          title: "Haqqani Network (HQN)",
        },

        {
          alt: "Harakat Sawa‘d Misr flag",
          photo: "/images/harakat.jpg",
          title: "Harakat Sawa‘d Misr (HASM)",
        },

        {
          alt: "Harakat ul-Jihad-i-Islami flag",
          photo: "/images/huj.png",
          title: "Harakatul-Jihad-ul-Islami (HUJI)",
        },

        {
          alt: "Harakat ul-Jihad-i-Islami/Bangladesh flag",
          photo: "/images/huj.png",
          title: " Harakat ul-Jihad-ul-Islami/Bangladesh (HUJI-B) ",
        },

        {
          alt: "Harakat ul-Mujahidin flag",
          photo: "/images/hum.png",
          title: "Harakatul-Mujahidin (HUM)",
        },

        {
          alt: "Hay’at Tahrir al-Sham flag",
          photo: "/images/hayat.png",
          title: " Hay’at Tahrir al-Sham (formerly Al-Nusrah Front) ",
        },

        {
          alt: "Hizbul Mujahideen flag",
          photo: "/images/hizbul.png",
          title: "HizbulMujahideen (HM)",
        },

        {
          alt: "Hurras al-Din flag",
          photo: "/images/hurras_al_din.jpg",
          title: "Hurrasal-Din",
        },

        {
          alt: "Indian Mujahedeen flag",
          photo: "/images/indian_mujahedeen.png",
          title: "Indian Mujahedeen (IM)",
        },

        { alt: "ISIS flag", photo: "/images/isis.png", title: "ISIS" },

        {
          alt: "ISIS-Bangladesh flag",
          photo: "/images/isis-b.png",
          title: "ISIS-Bangladesh",
        },

        {
          alt: "ISIS-DRC flag",
          photo: "/images/isis-drc.jpg",
          title: "ISIS–Democratic Republic of Congo (ISIS–DRC)",
        },

        {
          alt: "ISIS-Philippines flag",
          photo: "/images/isis-ea.png",
          title: "ISIS–East Asia (ISIS-Philippines)",
        },

        {
          alt: "ISIS-Khorasan flag",
          photo: "/images/isis-k.png",
          title: "ISIS-Khorasan",
        },

        {
          alt: "ISIS Libya flag",
          photo: "/images/isis-libya.png",
          title: "ISIS-Libya",
        },

        {
          alt: "ISIS-Mozambique flag",
          photo: "/images/mozambique.jpg",
          title: "ISIS-Mozambique",
        },

        {
          alt: "ISIS-Sahel flag",
          photo: "/images/isis_sahel.png",
          title: "ISIS-Sahel (a.k.a. ISIS–Greater Sahara)",
        },

        {
          alt: "ISIS Sinai flag",
          photo: "/images/isis-sinai.png",
          title: " ISIS-Sinai (formerly Ansar Bayt al-Maqdis) ",
        },

        {
          alt: "ISIS-Somalia flag",
          photo: "/images/isis.png",
          title: "ISIS-Somalia",
        },

        {
          alt: "ISIS-West Africa flag",
          photo: "/images/isis-west.png",
          title: "ISIS–West Africa",
        },

        {
          alt: "Islamic Jihad Union flag",
          photo: "/images/iju.png",
          title: "Islamic Jihad Union (IJU)",
        },

        {
          alt: "Islamic Movement of Uzbekistan flag",
          photo: "/images/islamic_mov_uzbekistan.png",
          title: "Islamic Movement of Uzbekistan (IMU)",
        },

        {
          alt: "IRGC flag",
          photo: "/images/irgc.png",
          title: "Islamic Revolutionary Guard Corps (IRGC)",
        },

        {
          alt: "Jaish-e-Mohammed (JEM) flag",
          photo: "/images/jem.png",
          title: "Jaish-e-Mohammad (JEM)",
        },

        {
          alt: "JNIM flag",
          photo: "/images/jnim_flag_oct2022.jpg",
          title: "Jama‘at Nusrat al-Islam wal-Muslimin (JNIM)",
        },

        {
          alt: "JuJaysh al-Adl flag",
          photo: "/images/jundallah_2.jpg",
          title: "Jayshal-Adl (formerly Jundallah)",
        },

        {
          alt: "Jaysh Rijal al-Tariq al Naqshabandi flag",
          photo: "/images/jrtn.png",
          title: "Jaysh Rijal al-Tariq al Naqshabandi (JRTN)",
        },

        {
          alt: "Jemmah Anshorut Tauhid flag",
          photo: "/images/jat.png",
          title: "Jemaah Anshorut Tauhid (JAT)",
        },

        {
          alt: "Jemaah Islamiya flag",
          photo: "/images/no-logo.png",
          title: "Jemaah Islamiya (JI)",
        },

        {
          alt: "Kata’ib Hizballah (Iraq) flag",
          photo: "/images/kataib_hizballah_2.png",
          title: "Kata’ib Hizballah (KH)",
        },

        {
          alt: "PKK flag",
          photo: "/images/kongra_gel_new.jpg",
          title: " Kurdistan Workers Party (PKK)(Kongra-Gel) ",
        },

        {
          alt: "Lashkar-e Jhangvi (LJ) flag",
          photo: "/images/lashkar_i_jhangvi.png",
          title: "Lashkar-e Jhangvi (LJ)",
        },

        {
          alt: "Lashkar-e Tayyiba flag",
          photo: "/images/lashkar_e_tayyiba_2.png",
          title: "Lashkar-e-Tayyiba (LT)",
        },

        {
          alt: "Lebanese Hizballah flag",
          photo: "/images/hizballah.png",
          title: "Lebanese Hizballah",
        },

        {
          alt: "LTTE flag",
          photo: "/images/ltte.png",
          title: "Liberation Tigers of Tamil Eelam (LTTE)",
        },

        {
          alt: "LTTE flag",
          photo: "/images/micha_liberation_flag.jpg",
          title: "Macina Liberation Front (MLF)",
        },

        {
          alt: "National Liberation Army (ELN) flag",
          photo: "/images/eln.png",
          title: "National Liberation Army (ELN)",
        },

        {
          alt: "Palestine Islamic Jihad (PIJ) flag",
          photo: "/images/pij.png",
          title: "Palestinian Islamic Jihad (PIJ)",
        },

        {
          alt: "Palestinian Liberation Front (PLF) flag",
          photo: "/images/plf.png",
          title: "Palestine Liberation Front (PLF)",
        },

        {
          alt: "Popular Front for the Liberation of Palestine (PFLP) flag",
          photo: "/images/pflp_2.png",
          title: " Popular Front for the Liberation of Palestine (PFLP) ",
        },

        {
          alt: "PFLP-GC flag",
          photo: "/images/pflpgc.png",
          title:
            " Popular Front for the Liberation of Palestine–General Command (PFLP-GC) ",
        },

        {
          alt: "Real Irish Republican Army flag",
          photo: "/images/rir_3.png",
          title: "Real Irish Republican Army (RIRA)",
        },

        {
          alt: "FARC-EP flag",
          photo: "/images/farc_flag.jpg",
          title:
            " Revolutionary Armed Forces of Colombia–People’s Army (FARC-EP) ",
        },

        {
          alt: "DHKP/C flag",
          photo: "/images/rplfront.png",
          title: " Revolutionary People’s Liberation Party/Front (DHKP/C) ",
        },

        {
          alt: "No Image Available",
          photo: "/images/no-logo.png",
          title: "Revolutionary Struggle",
        },

        {
          alt: "Segunda Marquetalia flag",
          photo: "/images/segunda_marquetalia.png",
          title: "Segunda Marquetalia",
        },

        {
          alt: "Shining Path flag",
          photo: "/images/shining_path.png",
          title: "Shining Path (SL)",
        },

        {
          alt: "Tehrik-e Taliban Pakistan flag",
          photo: "/images/ttp.png",
          title: "Tehrik-e Taliban Pakistan (TTP)",
        },
      ],
    };
  },
};
</script>

<!--start logos table-->
