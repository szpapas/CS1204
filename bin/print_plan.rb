#!/usr/bin/ruby
$:<<'/Library/Ruby/Gems/1.8/gems/pg-0.11.0/lib/'
#$:<<'/usr/local/lib/ruby/gems/1.8/gems/pg-0.12.2/lib/'

require 'pg'
$conn = PGconn.open(:dbname=>'CS1204', :user=>'postgres', :password=>'brightechs', :host=>'localhost', :port=>'5432')
$conn.exec("set standard_conforming_strings = off")

def save2timage(yxbh, path, dh, yx_prefix)
  yxdx=File.open(path).read.size
  edata=PGconn.escape_bytea(File.open(path).read) 
  yxmc="#{yx_prefix}-#{yxbh}"
  $conn.exec("delete from timage where dh='#{dh}' and yxbh='#{yxbh}';")
  $conn.exec("insert into timage (dh, yxmc, yxbh, yxdx, data) values ('#{dh}', '#{yxmc}', '#{yxbh}', #{yxdx}, E'#{edata}' );")
end

def split_string(text, length=16)
  char_array = text.unpack("U*")
  if char_array.size > length
    t1 = char_array[0..length-1].pack("U*")
    t2 = char_array[length..-1].pack("U*")
    return "#{t1}\n#{split_string(t2, length)}"
  else 
    return text
  end    
end

def print_plan(plan_id)
  dateStr = Time.now.strftime("%Y 年 %m 月 %d 日")
  
  user = $conn.exec("select * from plan where id = #{pid};")
  dd=user[0]
  xclx=split_string(dd['xclx'],15).split("\n")
  xcry=split_string(dd['xcry'],15).split("\n")
  xcfs=split_string(dd['xcfs'],15).split("\n")

  xcnr=split_string(dd['xcnr'],40).split("\n")
  draw_xcnr=''
  for kk in 0..xcnr.size-1
     draw_xcnr=draw_xcnr+" -draw \"text 180, #{395+30*kk} '#{xcnr[kk}'\" "
  end
  
  xcjg=split_string(dd['xcjg'],40).split("\n")
  draw_xcjg=''
  for kk in 0..xcjg.size-1
     draw_xcjg=draw_xcjg+" -draw \"text 180, #{620+30*kk} '#{xcjg[kk}'\" "
  end

  clyj=split_string(dd['clyj'],40).split("\n")
  draw_clyj=''
  for kk in 0..xcnr.size-1
     draw_clyj=draw_clyj+" -draw \"text 180, #{900+30*kk} '#{xcnr[kk}'\" "
  end

  convert_str="convert ./dady/xc_image_01.png -font  ./dady/STZHONGS.ttf  -pointsize 22 -draw \"text 280, 235 '#{dd['taskbegintime'}]'\" -draw \"text 280, 265 '#{dd['taskendtime']}'\" -draw \"text 725, 235 '#{xclx[0]}'\"  -draw \"text 725, 265 '#{xclx[1]}'\" -draw \"text 280, 295 '#{xcry[0]}'\" -draw \"text 280, 325 '#{xcry[1]}'\"  -draw \"text 725, 295 '#{xcfs[0]}'\"-draw \"text 725, 325 '#{xcfs[1]}'\" #{draw_xcnr} #{draw_xcjg} #{draw_clyj} ./dady/images/#{dd['xcbh']}-01.png "
  system convert_str
  puts "save to file  ./dady/images/#{dd['xcbh']}-01.png "
  #def save2timage(yxbh, path, dh, yx_prefix)
  save2timage("01.png", "./dady/images/#{dd['xcbh']}-01.png", dd['session_id'], "#{dd['xcbh']}")
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

plan_id = ARGV[0]
print_plan(plan_id)

$conn.close
#puts "***** End At #{Time.now}====\n"