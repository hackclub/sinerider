# Assets: Sounds

## Conversions

Most of our original sound assets are in mp3. We then convert them into the 2 following formats:

- compressed mp3 for compatibility anywhere
- flac encoded ogg for extreme compression

### OGG

You can convert the mp3 source file by running this ffmpeg command with these specific settings:

```
ffmpeg -i file.mp3 -c:a libvorbis -q:a 1 file.ogg -y
```
