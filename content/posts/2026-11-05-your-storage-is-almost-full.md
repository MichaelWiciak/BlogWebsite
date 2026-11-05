---
title: "Your storage is almost full"
excerpt: "A bi-yearly storage ritual, a missing hundred gigabytes, and the ghosts of apps I deleted"
tags: [macos, storage, cleanup]
published: true
---

Every six months or so, my Mac gives me a beautiful notification. Your storage is almost full. I close it, pretend I did not see it, and carry on for a few days. Then the machine starts to slow down, the fans come on, and I finally open System Settings to see what is going on.

The story it tells does not add up.

Applications: 62.17GB. Documents: 40.65GB. macOS: 30.65GB. Bin, Developer, Mail, Music, Podcasts: a few more gigabytes. And then System Data: Calculating… Photos: Calculating… The spinner sits there, thinking, while the bar says 244.31GB used out of 245.11GB.

Do those numbers add up? Of course not...

Let's do the arithmetic. Add up Applications, macOS and Documents, the chunkiest players. That is 130GB out of 245.11GB. The remaining 115GB is just… what? A void with no category?

So let me take you on the latest installment of cleaning adventure...

The first thing to understand is that the Storage pane is not a filesystem browser. It is a categoriser. It guesses which bucket a file belongs to, and when it does not know, it puts it in System Data or shows a spinner next to it.

This is where I take `du`, my best friend, who does not guess. Run it on your home folder:

```
sudo du -h -d 1 ~ | sort -hr | head -n 20
```

Here is what came back:

```
114G    /Users/michaelwiciak
 68G    /Users/michaelwiciak/Library
 36G    /Users/michaelwiciak/Library/Application Support
 17G    /Users/michaelwiciak/Library/Containers
8.5G    /Users/michaelwiciak/Applications
7.6G    /Users/michaelwiciak/Library/Caches
6.2G    /Users/michaelwiciak/.local
5.1G    /Users/michaelwiciak/Github
2.7G    /Users/michaelwiciak/.npm
2.1G    /Users/michaelwiciak/Library/pnpm
```

The 115GB here includes by 40GB of documents so its not the whole void. 

Unfortunaly, there are things even `du` could not read. Even with `sudo`, it printed `Operation not permitted` for Safari's cache, Mac's default apps and half of Application Support. On modern macOS, root is not above TCC (Transparency, Consent, and Control). You, as the owner of the device, are not allowed to touch it...

While we are here: why does a 256GB drive (binary always appears (: ) show 245.11GB? Formatting, APFS metadata, the recovery partition, and the system volume all take a cut. Instead of reflecing that in the statistics, they just lower the total...

Now let's go inside the Library.

```
du -h -d 1 ~/Library/Application\ Support | sort -hr
```

Application Support was 36GB. Google had 11GB, Microsoft 3.7GB, VS Code 3.7GB, etc. These are not applications. These are the applications' stuff. The `.app` is mostly the executable and its resources. The actual life of the app happens in `~/Library`. Three of these didn't exist on my machine for years, amounting for 5GBs.

Then I ran the same thing on Containers:

```
du -h -d 1 ~/Library/Containers | sort -hr
```

```
 17G    /Users/michaelwiciak/Library/Containers
 11G    /Users/michaelwiciak/Library/Containers/com.amazon.aiv.AIVApp
2.0G    /Users/michaelwiciak/Library/Containers/com.docker.docker
1.3G    /Users/michaelwiciak/Library/Containers/com.apple.mediaanalysisd
556M    /Users/michaelwiciak/Library/Containers/com.utmapp.UTM
466M    /Users/michaelwiciak/Library/Containers/com.x-wave.eXtraVoiceRecorderLite
399M    /Users/michaelwiciak/Library/Containers/com.apple.geod
```

Eleven gigabytes for one app. Amazon Prime which I installed and promply deleted 5 years ago. What is it doing behind this new name? That was the first ghost found. 

The second ghost was Chrome. I do not have Chrome. I uninstalled it a year ago and switched to Zen. And yet:

```
du -h -d 1 ~/Library/Application\ Support/Google
8.8G    .
8.2G    ./Chrome
644M    ./DriveFS
```

What was in it? Cache, profile, history, extensions, the lot. It was not attached to anything. It was just there, and macOS had been counting it as my problem the whole time.

There were data from about 10 apps I deleted but the data stayed. So I started deleting it:

How? 

```
rm -rf !!!!!! babyyyyyy
```

The OS had no idea this data was orphaned. Why? Why is it not different? 

Because the OS has no idea which files belong to which app. There is no ownership, no reference count. An app can write to its container, Application Support, Caches, Preferences, Group Containers, Logs, Saved Application State. When you drag the `.app` to the Trash, macOS deletes the bundle and nothing else. It cannot know whether the 8GB is a cache, a save file, a license, or your only copy of something. So it leaves it. Every OS does some version of this: Windows leaves AppData, Linux leaves `~/.config` and `~/.cache`, iOS keeps your data when it offloads an app. It is the price of letting apps have state.

Is that really the best we can do, dear OSes?

The caches cleaning simpler. Spotify 1.9GB, Homebrew 1.3GB, go-build 1GB, VS Code's ShipIt 940MB, Mozilla 752MB, zen 345MB, goimports 267MB, Steam 227MB, pip 189MB. They regenerate. The cost is a slower next launch, and maybe a re-download.

Check the other suspects too: local Time Machine snapshots (`tmutil listlocalsnapshots /`), iOS backups in `~/Library/Application Support/MobileSync`, and the Trash. APFS can keep deleted blocks alive in snapshots.

When you uninstall an app, uninstall its data too. Use its uninstaller, or `brew uninstall --zap` if it came from Homebrew. If you do it by hand, quit the app first, remove its folders from `~/Library`, and back up saves and licenses.

The deeper lesson is that storage is not a filing cabinet but a museum. It is a living system with a memory and the files you see are the tip.

I got back about 40GB. The Storage pane still says Calculating… for System Data. I am not sure it will ever finish. Maybe that is the point.

The only solution to this is to wipe the machine and start over, but today is not the day.

Thanks for reading (:
