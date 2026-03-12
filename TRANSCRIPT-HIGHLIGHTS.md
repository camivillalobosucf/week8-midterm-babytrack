# BabyTrack Transcript Highlights

5 key moments from the build sessions that shaped how this project came together, I exported so many transcripts because claude starts compiling the conversation, I learned this the hard way lol.

# 1. Architecture Before Code (transcript1)

The very first thing I did was asking for the architecture plan, this was firestone structure, folder layout, component breakdown and implementation order, all of this before claude started to write code. Doing this first meant that all the other phases had a clear baseline to start from, instead of revising the app on fundamental aspects in the middle of building and developing. Claude did 6 phases and then I started working through those.

# 2. Learning how .env.local works (transcript1, transcript2)

After phase 1, I pasted the firebase config without the secret data, and I questioned claude if that was what I needed to paste, and claude replied back that the only thing I needed in the file was the info formatted as VITE_KEY=value, this was a great thing to learn since the first time I tried to do this app, I committed secret information to github, so in this time I was extra careful asking what I needed and how to do it properly from the begginning.

## 3. Choosing `onSnapshot` for Real-Time Data (transcript3)

When building phase 3, the feeding, diaper, and sleep trackers, I set them up to stay connected to the database at all times, not just fetch data once and stop listening, so whenever anything changes in the database (for example a new feeding is added, an entry is deleted) the app automatically updates on screen without you needing to refresh the page. This ended up being really important later, because the Dashboard's summary cards could show up-to-date numbers in real time without any extra work.

## 4. Netlify Secrets Scanner Blocked the Deploy (transcript5)

The first time I tried to deploy to netlify, the deployment failed, because the platform's secret scanner flagged the VITE_FIREBASE environment variables, even though the client keys are intentionally public, Netlify's scanner saw them as if they were secrets, and this fix required adding SECRETS_SCAN_OMIT_KEYS to netlifu.toml, so this would not be a problem anymore. I was able to determine this was the issue by going back and forth with claude, pasting what netlify ai scanner told me the issue was.

## 5. Spanish Translation Gaps Caught at Runtime (transcript7 / transcript8)

After the spanish feature was built, my own testing revealed that several strings were still appearing in english, for example timestamps like "19h ago", sleep quality labels, feeding side labels, and the baby's age string. I told claude to update what was necessary to make the formatters locale-aware rather than hardcoded. In this phase I also gave claude new .svg files so the logo would show up better on the dark background, without a white box from the .jpg files.
