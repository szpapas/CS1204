#!/usr/bin/ruby
$:<<'/Library/Ruby/Gems/1.8/gems/pg-0.11.0/lib/'
#$:<<'/usr/local/lib/ruby/gems/1.8/gems/pg-0.12.2/lib/'

require 'pg'
$conn = PGconn.open(:dbname=>'CS1204', :user=>'postgres', :password=>'brightechs', :host=>'localhost', :port=>'5432')
$conn.exec("set standard_conforming_strings = off")

def save2timage(yxbh, path, dh, yx_prefix)
  yxdx=File.open(path).read.size
  edata=PGconn.escape_bytea(File.open(path).read) 
  yxmc="#{yx_prefix}_#{yxbh}"
  $conn.exec("delete from timage_tjtx where dh='#{dh}' and yxbh='#{yxbh}';")
  $conn.exec("insert into timage_tjtx (dh, yxmc, yxbh, yxdx, data) values ('#{dh}', '#{yxmc}', '#{yxbh}.jpg', #{yxdx}, E'#{edata}' );")
end


def print_plan(pid)
  dateStr = Time.now.strftime("%Y 年 %m 月 %d 日")
  
  user = $conn.exec("select * from plan where id = #{pid};")

  convert_str =  "convert ./dady/xc_image_01.png -font ./dady/SimHei.ttf  -pointsize 44 -draw \"text 465, 208 '' \"  -font ./dady/STZHONGS.ttf  -pointsize 26 -draw \"text 690, 260 '#{dateStr}'\" " 

  #convert ./dady/xc_image_01.png -font  ./dady/STZHONGS.ttf  -pointsize 22 -draw "text 280, 265 '巡查时间'" -draw "text 725, 235 '巡查人员'" -draw "text 725, 265 '巡查人员2'" -draw "text 280, 295 '巡查路线'" -draw "text 280, 325 '巡查路线2'" -draw "text 725, 295 '巡查方式'" -draw "text 725, 325 '巡查方式2'" -draw "text 180, 395 '巡查内容1'" -draw "text 180, 425 '巡查内容2'" -draw "text 180, 455 '巡查内容3'" -draw "text 180, 485 '巡查内容4'" -draw "text 180, 515 '巡查内容5'" -draw "text 180, 545 '巡查内容6'" -draw "text 180, 620 '巡查结果1'" -draw "text 180, 650 '巡查结果2'" -draw "text 180, 680 '巡查结果3'" -draw "text 180, 710 '巡查结果4'" -draw "text 180, 740 '巡查结果5'" -draw "text 180, 770 '巡查结果6'" -draw "text 180, 800 '巡查结果7'" -draw "text 180, 830 '巡查结果8'" xctx_0001.png

  system convert_str
  puts " save to file  /share/tjsj/timage_#{dh}_#{sxh}.jpg"
  save2timage("#{sxh}.jpg", "/share/tjsj/timage_#{dh}_#{sxh}.jpg", dh, "timage_#{dh}")

end


# ********************************************************************************************
#
#   main fucntions 
#
#    @qzh ---
#    @dalb ---
#    @mlh ---
#    
#
#*********************************************************************************************

dh = ARGV[0]

update_timage(dh)
print_timage(dh)

$conn.close
#puts "***** End At #{Time.now}====\n"