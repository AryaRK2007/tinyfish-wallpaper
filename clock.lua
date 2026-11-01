-- clock.lua: Universal OSD Clock & Date Overlay
function update_clock()
    local time_str = os.date("%I:%M %p")
    local date_str = os.date("%A, %b %d")

    -- ASS Vector Styling (Top-Left 50px offset, bold white text with black outline)
    local ass_text = string.format(
        "{\\an7\\pos(50,50)\\b1\\1c&HFFFFFF&\\3c&H000000&\\bord3\\fs54}%s\\N{\\fs22\\1c&HDDDDDD&}%s",
        time_str,
        date_str
    )

    -- Native mpv OSD rendering (virtual resolution 1280x720)
    mp.set_osd_ass(1280, 720, ass_text)
end

-- Update every 1 second
mp.add_periodic_timer(1, update_clock)
update_clock()