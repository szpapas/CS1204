#coding: utf-8 
#BASE_DIR="/Library/Ruby/Gems/1.8/gems"
BASE_DIR="/usr/local/lib/ruby/gems/1.8/gems"
$: << "#{BASE_DIR}/prawn-1.0.0.rc1" << "#{BASE_DIR}/ttfunk-1.0.3/lib" << "#{BASE_DIR}/pdf-reader-1.2.0/lib" << "#{BASE_DIR}/Ascii85-1.0.2/lib"  << "#{BASE_DIR}/hashery-2.0.1/lib" << "#{BASE_DIR}/ruby-rc4-0.1.5/lib" << "#{BASE_DIR}/pg-0.12.2/lib"

require 'rubygems'
require 'bundler'

require 'prawn'
require 'prawn/security'
require "prawn/layout"

require 'pg'
$conn = PGconn.open(:dbname=>'CS1204', :user=>'postgres', :password=>'brightechs', :host=>'localhost', :port=>'5432')
$conn.exec("set standard_conforming_strings = off")

def gen_pdf(plan_id)
  
  dateStr = Time.now.strftime("%Y年%m月%d日")
  puts dateStr
  user = $conn.exec("select * from plans where id = #{plan_id};")
  dd=user[0]
  
  xclx = dd['xclx'] || ""
  xcry = dd['xcry'] || ""
  xcfs = dd['xcfs'] || ""
  
  xcnr = dd['xcnr'] || ""
  xcjg = dd['xcjg'] || ""
  clyj = dd['clyj'] || ""
  
  pdf_url = "./dady/xcjl/xcjl_#{plan_id}.pdf"
  
  Prawn::Document.generate("#{pdf_url}") do 
    self.font_size = 12
    move_down 20
  
    font "#{Prawn::DATADIR}/fonts/simhei.ttf"
    text "常熟市国土资源监察大队土地执法监察巡回检查记录", :align => :center, :size => 18
    move_down 5
    table([["打印日期：#{dateStr}"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,365],:inline_format => true, :border_width => 0})
    table([["<font size='14'>巡查\n时间</font>", "#{dd['taskbegintime']}-\n#{dd['taskendtime']}", "<font size='14'>巡查\n路线</font>", "#{xclx}"],["<font size='14'>巡查\n人员</font>", "#{xcry}", "<font size='14'>巡查\n方式</font>", "#{xcfs}"]], :position => :center, :width => 520, :column_widths => [50, 210, 50, 210], :cell_style => {:padding => [5,0,5,10],:inline_format => true})
    table([["<font size='14'>巡查内容</font>"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true, :background_color => "CCCCCC"})
  
    if xcnr.length < 600 
      table([["#{xcnr}"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true, :height => 80 })
    else  
      table([["#{xcnr}"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true})
    end
    
    table([["<font size='14'>巡查结果</font>"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true, :background_color => "CCCCCC"})
    if xcjg.length < 600 
      table([["#{xcjg}"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true, :height => 80 })
    else  
      table([["#{xcjg}"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true})
    end

    table([["<font size='14'>处理意见或结果</font>"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true, :background_color => "CCCCCC"})
    if clyj.length < 600 
      table([["#{clyj}"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true, :height => 80 })
    else  
      table([["#{clyj}"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true})
    end
  
    table([["<font size='14'>巡查图片</font>"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,10],:inline_format => true, :background_color => "CCCCCC"})  
    table([[{:image => "prawn.png"},{:image => "prawn.png", :position => :center}]], :position => :center, :width => 520)
 
    move_down 30
    table([["巡查人签名：______________________"]], :position => :center, :width => 520, :cell_style => {:padding => [5,0,5,300],:inline_format => true, :border_width => 0})

    #image "prawn.png", :at => [200, 600]
  
  end

end

gen_pdf(ARGV[0])

$conn.close