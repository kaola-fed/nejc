```bash
.
├── base
│   ├── chain.js
│   ├── config.js
│   ├── constant.js
│   ├── element.js
│   ├── event.js
│   ├── global.js
│   ├── klass.js
│   ├── platform
│   │   ├── config.js
│   │   ├── config.patch.js
│   │   ├── element.js
│   │   ├── element.patch.js
│   │   ├── event.js
│   │   ├── event.patch.js
│   │   ├── util.js
│   │   └── util.patch.js
│   ├── platform.js
│   └── util.js
├── ui
└── util
    ├── ajax
    │   ├── demo
    │   │   ├── a.html
    │   │   ├── tag.html
    │   │   └── upload.html
    │   ├── dwr.js
    │   ├── loader
    │   │   ├── html.js
    │   │   ├── loader.js
    │   │   ├── platform
    │   │   │   ├── html.js
    │   │   │   └── html.patch.js
    │   │   ├── script.js
    │   │   ├── style.js
    │   │   ├── test
    │   │   │   ├── loader.test.html
    │   │   │   └── loader.test.js
    │   │   └── text.js
    │   ├── message.js
    │   ├── platform
    │   │   ├── message.js
    │   │   ├── message.patch.js
    │   │   ├── xdr.js
    │   │   └── xdr.patch.js
    │   ├── proxy
    │   │   ├── flash.js
    │   │   ├── frame.js
    │   │   ├── platform
    │   │   │   ├── xhr.js
    │   │   │   └── xhr.patch.js
    │   │   ├── proxy.js
    │   │   ├── upload.js
    │   │   └── xhr.js
    │   ├── rest.js
    │   ├── tag.js
    │   ├── test
    │   │   ├── message.test.html
    │   │   ├── message.test.js
    │   │   ├── tag.test.html
    │   │   ├── tag.test.js
    │   │   ├── x.css
    │   │   ├── xdr.test.html
    │   │   ├── xdr.test.js
    │   │   ├── xx.css
    │   │   └── xxx.txt
    │   └── xdr.js
    ├── animation
    │   ├── animation.js
    │   ├── bezier.js
    │   ├── bounce.js
    │   ├── decelerate.js
    │   ├── demo
    │   │   └── easeout.html
    │   ├── easein.js
    │   ├── easeinout.js
    │   ├── easeout.js
    │   ├── linear.js
    │   └── test
    │       ├── animation.test.html
    │       └── animation.test.js
    ├── audio
    │   ├── audio.js
    │   ├── platform
    │   │   ├── audio.js
    │   │   └── audio.patch.js
    │   └── test
    │       ├── audio.test.html
    │       └── audio.test.js
    ├── cache
    │   ├── abstract.js
    │   ├── cache.js
    │   ├── cache.list.base.js
    │   ├── cache.list.js
    │   ├── cache.share.js
    │   ├── cookie.js
    │   ├── database.js
    │   ├── list.js
    │   ├── manager.js
    │   ├── platform
    │   │   ├── storage.js
    │   │   └── storage.patch.js
    │   ├── share.js
    │   ├── storage.js
    │   └── test
    │       ├── cache.custom.js
    │       ├── cache.list.custom.js
    │       ├── cache.test.html
    │       ├── cache.test.js
    │       ├── cookie.test.html
    │       ├── cookie.test.js
    │       ├── storage.test.html
    │       └── storage.test.js
    ├── calendar
    │   └── calendar.js
    ├── chain
    │   ├── NodeList.js
    │   ├── README.md
    │   ├── chainable.js
    │   └── test
    │       ├── chainable.test.html
    │       ├── chainable.test.js
    │       ├── fixture.test.html
    │       ├── playjs.sublime-project
    │       └── playjs.sublime-workspace
    ├── chart
    │   └── chart.js
    ├── clipboard
    │   ├── clipboard.js
    │   └── test
    │       ├── clipboard.test.html
    │       └── clipboard.test.js
    ├── clipper
    │   ├── clipper.js
    │   └── demo
    │       └── clipper.html
    ├── color
    │   └── color.js
    ├── counter
    │   ├── counter.js
    │   ├── demo
    │   │   └── counter.html
    │   ├── platform
    │   │   ├── counter.js
    │   │   └── counter.patch.js
    │   └── test
    │       ├── counter.test.html
    │       └── counter.test.js
    ├── cursor
    │   ├── cursor.js
    │   └── platform
    │       ├── cursor.js
    │       └── cursor.patch.js
    ├── cycler
    │   ├── cycler.js
    │   └── test
    │       ├── cycler.test.html
    │       └── cycler.test.js
    ├── data
    │   ├── portrait
    │   │   └── portrait.js
    │   └── region
    │       └── zh.js
    ├── dispatcher
    │   ├── dispatcher.2.js
    │   ├── dispatcher.js
    │   ├── dsp
    │   │   ├── group.js
    │   │   ├── node.js
    │   │   ├── single.js
    │   │   └── util.js
    │   ├── module.base.js
    │   ├── module.js
    │   ├── platform
    │   │   ├── dispatcher.js
    │   │   └── dispatcher.patch.js
    │   ├── test
    │   │   ├── c
    │   │   │   ├── c1.js
    │   │   │   ├── c2.js
    │   │   │   ├── index.css
    │   │   │   └── index.js
    │   │   ├── dispatcher.2.test.html
    │   │   ├── dispatcher.2.test.js
    │   │   ├── m
    │   │   │   ├── a.html
    │   │   │   ├── b.html
    │   │   │   ├── c.html
    │   │   │   ├── c1.html
    │   │   │   ├── c2.html
    │   │   │   └── root.html
    │   │   ├── private.module.test.html
    │   │   ├── private.module.test.js
    │   │   └── root
    │   │       ├── index.css
    │   │       └── index.js
    │   └── test.js
    ├── dragger
    │   ├── dragger.js
    │   └── test
    │       ├── dragger.test.html
    │       └── dragger.test.js
    ├── editor
    │   ├── area.js
    │   ├── command
    │   │   ├── backcolor.js
    │   │   ├── blockquote.js
    │   │   ├── bold.js
    │   │   ├── card.js
    │   │   ├── color.js
    │   │   ├── font.js
    │   │   ├── fontname.js
    │   │   ├── fontsize.js
    │   │   ├── forecolor.js
    │   │   ├── format.js
    │   │   ├── insertorderedlist.js
    │   │   ├── insertunorderedlist.js
    │   │   ├── italic.js
    │   │   ├── justifycenter.js
    │   │   ├── justifyleft.js
    │   │   ├── justifyright.js
    │   │   ├── link.js
    │   │   ├── removeformat.js
    │   │   ├── simple.js
    │   │   ├── space.js
    │   │   ├── strikethrough.js
    │   │   ├── superscript.js
    │   │   ├── underline.js
    │   │   └── uploadimage.js
    │   ├── command.js
    │   ├── editor.js
    │   ├── platform
    │   │   ├── editor.js
    │   │   ├── editor.patch.js
    │   │   └── editor.td.js
    │   └── toolbar.js
    ├── effect
    │   ├── api.js
    │   ├── effect.api.js
    │   ├── effect.js
    │   ├── platform
    │   │   ├── effect.api.js
    │   │   ├── effect.api.patch.js
    │   │   ├── effect.js
    │   │   └── effect.patch.js
    │   └── test
    │       ├── effcet.api.test.html
    │       ├── effect.api.test.js
    │       ├── effect.test.html
    │       └── effect.test.js
    ├── encode
    │   ├── base64.js
    │   ├── crc32.js
    │   ├── demo
    │   │   └── json.html
    │   ├── json.js
    │   ├── md5.js
    │   ├── platform
    │   │   ├── 3rd.json.js
    │   │   ├── json.js
    │   │   └── json.patch.js
    │   ├── sha.md5.js
    │   └── test
    │       ├── base64.test.html
    │       └── base64.test.js
    ├── es
    │   ├── array.js
    │   ├── demo
    │   │   └── array.html
    │   └── platform
    │       ├── array.js
    │       └── array.patch.js
    ├── event
    │   └── event.js
    ├── event.js
    ├── file
    │   ├── demo
    │   │   ├── file.html
    │   │   ├── select.html
    │   │   └── upload
    │   ├── platform
    │   │   ├── select.js
    │   │   └── select.patch.js
    │   ├── save.js
    │   ├── select.js
    │   └── test
    │       ├── save.test.html
    │       ├── save.test.js
    │       ├── select.test.html
    │       └── select.test.js
    ├── flash
    │   ├── flash.html
    │   ├── flash.js
    │   ├── platform
    │   │   ├── flash.js
    │   │   └── flash.patch.js
    │   └── test
    │       ├── flash.test.html
    │       └── flash.test.js
    ├── focus
    │   ├── focus.js
    │   ├── platform
    │   │   ├── focus.js
    │   │   └── focus.patch.js
    │   └── test
    │       ├── focus.test.html
    │       └── focus.test.js
    ├── form
    │   ├── demo
    │   │   └── form.html
    │   ├── form.js
    │   └── test
    │       ├── form.test.html
    │       └── form.test.js
    ├── gestrue
    │   ├── drag.js
    │   ├── gestrue.js
    │   ├── pinch.js
    │   ├── rotate.js
    │   ├── swipe.js
    │   └── tap.js
    ├── helper
    │   └── select.js
    ├── highlight
    │   ├── test
    │   │   ├── highlight.test.html
    │   │   └── highlight.test.js
    │   └── touch.js
    ├── history
    │   ├── history.js
    │   ├── history.override.js
    │   ├── manager.js
    │   └── platform
    │       ├── history.js
    │       └── history.patch.js
    ├── hover
    │   ├── hover.js
    │   ├── platform
    │   │   ├── hover.js
    │   │   └── hover.patch.js
    │   └── test
    │       ├── hover.test.html
    │       └── hover.test.js
    ├── lazy
    │   ├── demo
    │   │   └── image.html
    │   ├── image.js
    │   └── loading.js
    ├── lightbox
    │   ├── demo
    │   │   └── lightbox.html
    │   └── lightbox.js
    ├── list
    │   ├── holder.js
    │   ├── module.js
    │   ├── module.pager.js
    │   ├── module.waterfall.js
    │   ├── page.js
    │   ├── test
    │   │   ├── cache.list.custom.js
    │   │   ├── module.pager.test.html
    │   │   └── module.pager.test.js
    │   └── waterfall.js
    ├── media
    │   ├── audio.js
    │   ├── flash.js
    │   ├── media.js
    │   ├── playlist.js
    │   └── test
    │       ├── audio.test.html
    │       └── audio.test.js
    ├── page
    │   ├── base.js
    │   ├── page.base.js
    │   ├── page.js
    │   ├── page.simple.js
    │   └── simple.js
    ├── placeholder
    │   ├── demo
    │   │   └── placeholder.html
    │   ├── placeholder.js
    │   ├── platform
    │   │   ├── holder.js
    │   │   └── holder.patch.js
    │   └── test
    │       ├── placeholder.test.html
    │       └── placeholder.test.js
    ├── profile
    │   └── profile.js
    ├── query
    │   ├── demo
    │   │   └── demo.html
    │   ├── nes.js
    │   └── query.js
    ├── range
    │   ├── demo
    │   │   └── range.html
    │   ├── range.js
    │   └── test
    │       ├── range.test.html
    │       └── range.test.js
    ├── region
    │   ├── demo
    │   │   └── at.html
    │   ├── region.zh.js
    │   ├── test
    │   │   ├── region.zh.test.html
    │   │   └── region.zh.test.js
    │   └── zh.js
    ├── resize
    │   ├── demo
    │   │   └── resize.html
    │   ├── resize.js
    │   └── test
    │       ├── resize.test.html
    │       └── resize.test.js
    ├── scroll
    │   ├── demo
    │   │   ├── simple.html
    │   │   └── smart.html
    │   ├── scroll.simple.js
    │   ├── simple.js
    │   └── smart.js
    ├── selector
    │   ├── cascade.js
    │   ├── demo
    │   │   └── cascade.html
    │   ├── range.js
    │   ├── selector.js
    │   └── selector.range.js
    ├── slider
    │   ├── demo
    │   │   └── simple.html
    │   ├── simple.js
    │   ├── slider.js
    │   ├── slider.simple.js
    │   ├── slider.x.js
    │   ├── slider.xy.js
    │   ├── slider.y.js
    │   ├── test
    │   │   ├── slider.test.html
    │   │   ├── slider.test.js
    │   │   └── sorter.test.js
    │   ├── x.js
    │   ├── xy.js
    │   └── y.js
    ├── sort
    │   ├── demo
    │   │   ├── horizontal.html
    │   │   ├── horizontal.trigger.html
    │   │   ├── vertical.html
    │   │   └── vertical.trigger.html
    │   ├── horizontal.js
    │   ├── sortable.js
    │   └── vertical.js
    ├── suggest
    │   ├── at.js
    │   ├── demo
    │   │   ├── at.html
    │   │   └── suggest.html
    │   ├── suggest.js
    │   └── test
    │       ├── suggest.test.html
    │       └── suggest.test.js
    ├── tab
    │   ├── tab.js
    │   ├── tab.view.js
    │   ├── test
    │   │   ├── tab.test.html
    │   │   └── tab.test.js
    │   └── view.js
    ├── template
    │   ├── demo
    │   │   ├── a.html
    │   │   └── tpl.html
    │   ├── jst.js
    │   ├── test
    │   │   ├── jst.test.html
    │   │   ├── jst.test.js
    │   │   ├── myItem.js
    │   │   ├── tpl.test.html
    │   │   └── tpl.test.js
    │   ├── tpl.js
    │   └── trimpath.js
    ├── timer
    │   ├── animation.js
    │   ├── interval.js
    │   └── platform
    │       ├── animation.js
    │       └── animation.patch.js
    └── toggle
        ├── demo
        │   └── toggle.html
        ├── test
        │   ├── toggle.test.html
        │   └── toggle.test.js
        └── toggle.js

174 directories, 517 files
```
