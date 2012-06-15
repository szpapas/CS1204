#!/usr/bin/ruby
#$:<<'/Library/Ruby/Gems/1.8/gems/pg-0.11.0/lib/'
$:<<'/usr/local/lib/ruby/gems/1.8/gems/pg-0.12.2/lib/'
#$:<<'/usr/share/devicemgr/backend/vendor/gems/pg-0.9.0/lib/'

require 'pg'
require 'find'

# ********************************************************************************************
#
#   main fucntions 
#
#    @ARGV[0] --- 
#   
#    ruby save_imae.rb  
#*********************************************************************************************

$conn = PGconn.open(:dbname=>'CS1204', :user=>'postgres', :password=>'brightechs', :host=>'localhost', :port=>'5432')
$conn.exec("set standard_conforming_strings = off")

yxpath, pic_name, tpjd, bz, xmdk_id, task_id = ARGV[0], ARGV[1], ARGV[2], ARGV[3], ARGV[4], ARGV[1]

#insert into database  
exif_file =rand(36**32).to_s(36)
system("exif #{yxpath}/#{pic_name} > #{exif_file}")
File.open("#{exif_file}").each_line do |line|
  if line.include?('Longitude')
    ll = line.chomp.split("|")[1].strip.split(",")
    $lon = ll[0].to_f + ll[1].to_f/60.0+ll[2].to_f/3600.0
  end
  if line.include?('Latitude')
    ll = line.chomp.split("|")[1].strip.split(",")
    $lat = ll[0].to_f + ll[1].to_f/60.0+ll[2].to_f/3600.0
  end
  if line.include?('Date and Time') 
    dd = line.chomp.split("|")[1].strip.split(" ")
    $tpsj = dd[0].gsub(":", "-") + " " + dd[1]
  end   
end

lonlat = "geomFromText('Point(#{$lon} #{$lat})',4326)"

#update database
path = "#{yxpath}/#{pic_name}"
fo = File.open(path).read
yxdx = fo.size
edata=PGconn.escape_bytea(fo)
$conn.exec("insert into xcimage (yxmc, the_geom, rq, tpjd, bz, xmdk_id, plan_id, yxdx, data) values 
    ('#{pic_name}',  #{lonlat}, '#{$tpsj}', '#{tpjd}', '#{bz}', #{xmdk_id}, #{task_id}, #{yxdx}, E'#{edata}');")
$conn.exec("update plans set photo_count = (select count(*) from xcimage where plan_id=#{task_id}) where id=#{task_id};")
system("rm -rf #{exif_file}")

$conn.close

puts "=== Total time is #{Time.now-t1} seconds"
